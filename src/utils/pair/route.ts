import BigNumber from "bignumber.js";
import Hashids from "hashids";
import { Uniswap } from "@/utils/swap/uniswap";
import { Curve } from "@/utils/swap/curve";

const HASH_SALT = "uniswap routes";
const uniswap = new Uniswap();
const curve = new Curve(200);
const precision = 8;

export type SwapParams = {
  inputAsset: string;
  outputAsset: string;
  inputAmount?: string;
  outputAmount?: string;
};

export type RouteCtx = {
  routeAssets: string[];
  routeIds: number[];
  amount: number;
  funds: number;
  priceImpact: number;
};

export type RoutePair = API.Pair & {
  K: number;
  baseAmount: number;
  quoteAmount: number;
  fillPercent: number;
};

export class PairRoutes {
  pairs: RoutePair[] = [];

  routes: Map<string, string[]> = new Map();

  makeRoutes(pairs: API.Pair[]) {
    this.pairs = pairs.map((p) => {
      const baseAmount = Number(p.base_amount);
      const quoteAmount = Number(p.quote_amount);
      const fillPercent = new BigNumber(1).minus(p.fee_percent).toNumber();
      const isCurve = p.swap_method === "curve";
      let d = 0;
      if (isCurve) {
        d = curve.getD([baseAmount * 10e8, quoteAmount * 10e8]);
      }
      return {
        ...p,
        baseAmount,
        quoteAmount,
        fillPercent,
        K: baseAmount * quoteAmount,
        D: d,
      };
    });
    for (const pair of this.pairs) {
      this.setAssetRoute(pair.base_asset_id, pair);
      this.setAssetRoute(pair.quote_asset_id, pair);
    }
  }

  setAssetRoute(asset: string, pair: RoutePair) {
    const routes = this.routes.get(asset) || [];
    const opposit = this.getOppositeAsset(pair, asset);
    if (!routes.includes(opposit)) {
      this.routes.set(asset, [...routes, opposit]);
    }
  }

  getPair(base: string, quote: string) {
    return this.pairs.find((p) => {
      const pair1 = p.base_asset_id === base && p.quote_asset_id === quote;
      const pair2 = p.base_asset_id === quote && p.quote_asset_id === base;
      return pair1 || pair2;
    });
  }

  getPairByRouteId(id: number) {
    return this.pairs.find((p) => {
      return p.route_id === id;
    });
  }

  getOppositeAsset(pair: RoutePair, input: string) {
    return input === pair.base_asset_id
      ? pair.quote_asset_id
      : pair.base_asset_id;
  }

  getPreOrder({
    inputAsset,
    outputAsset,
    inputAmount,
    outputAmount,
  }: SwapParams): Promise<any> {
    return new Promise((resolve, reject) => {
      let bestRoute: RouteCtx | null = null;
      let funds = inputAmount;
      let amount = outputAmount;

      if (inputAmount) {
        if (+inputAmount <= 0) {
          reject("swap.error.input-amount-invalid");
          return;
        }

        bestRoute = this.getRoutes(inputAsset, outputAsset, +inputAmount);
        amount = new BigNumber(bestRoute?.amount ?? 0)
          .decimalPlaces(precision, BigNumber.ROUND_DOWN)
          .toString();
      } else if (outputAmount) {
        if (+outputAmount <= 0) {
          reject("swap.error.output-amount-invalid");
          return;
        }

        bestRoute = this.getRoutesReverse(
          inputAsset,
          outputAsset,
          +outputAmount
        );
        funds = new BigNumber(bestRoute?.funds ?? 0)
          .decimalPlaces(precision, BigNumber.ROUND_CEIL)
          .toString();
      } else {
        reject("swap.error.need-input-or-output");
        return;
      }

      if (!bestRoute) {
        reject("swap.error.no-pair-route-found");
        return;
      }

      if (!amount || !funds) {
        reject("swap.error.swap-amount-not-support");
        return;
      }

      if (+amount <= 0 || +funds <= 0) {
        reject("swap.error.swap-amount-not-support");
        return;
      }

      resolve({
        ...bestRoute,
        amount,
        funds,
        route_assets: bestRoute.routeAssets,
        price_impact: bestRoute.priceImpact,
        routes: new Hashids(HASH_SALT).encode(bestRoute.routeIds),
        fill_asset_id: outputAsset,
        pay_asset_id: inputAsset,
        state: "Done",
      });
    });
  }

  getRoutes(inputAsset: string, outputAsset: string, inputAmount: number) {
    const deep = 4;
    const queue: { key: string; ctx: RouteCtx }[] = [];
    let bestRoute: RouteCtx | null = null;

    queue.push({
      key: inputAsset,
      ctx: {
        routeAssets: [inputAsset],
        routeIds: [],
        amount: 0,
        funds: 0,
        priceImpact: 0,
      },
    });

    while (queue.length > 0) {
      const current = queue.pop()!;
      const stepInputAmount = current.ctx.amount || inputAmount;
      const neibors = this.routes.get(current.key) || [];

      for (const neibor of neibors) {
        if (
          current.ctx.routeIds.length === deep - 1 &&
          neibor !== outputAsset
        ) {
          continue;
        }

        const pair = this.getPair(current.key, neibor)!;
        if (!pair) continue;
        if (current.ctx.routeIds.includes(pair.route_id)) continue;

        const transaction = this.swap(pair, current.key, +stepInputAmount);
        if (!transaction) continue;

        const newCtx: RouteCtx = {
          routeAssets: [...current.ctx.routeAssets, neibor],
          routeIds: [...current.ctx.routeIds, pair.route_id],
          amount: transaction.amount,
          funds: transaction.funds,
          priceImpact:
            (1 + current.ctx.priceImpact) * (1 + transaction.priceImpact) - 1,
        };

        if (neibor === outputAsset) {
          if (!bestRoute || Number(bestRoute.amount) < Number(newCtx.amount)) {
            bestRoute = newCtx;
          }
          continue;
        }

        if (newCtx.routeIds.length < deep) {
          queue.push({ key: neibor, ctx: newCtx });
        }
      }
    }

    return bestRoute;
  }

  getRoutesReverse(
    inputAsset: string,
    outputAsset: string,
    outputAmount: number
  ) {
    const deep = 4;
    const queue: { key: string; ctx: RouteCtx }[] = [];
    let bestRoute: RouteCtx | null = null;

    queue.push({
      key: outputAsset,
      ctx: {
        routeAssets: [outputAsset],
        routeIds: [],
        amount: 0,
        funds: 0,
        priceImpact: 0,
      },
    });

    while (queue.length > 0) {
      const current = queue.pop()!;
      const stepOutputAmount = current.ctx.funds || outputAmount;
      const neibors = this.routes.get(current.key) || [];

      for (const neibor of neibors) {
        if (current.ctx.routeIds.length === deep - 1 && neibor !== inputAsset) {
          continue;
        }

        const pair = this.getPair(current.key, neibor)!;
        if (!pair) continue;
        if (current.ctx.routeIds.includes(pair.route_id)) continue;

        const transaction = this.swapReverse(pair, neibor, stepOutputAmount);
        if (!transaction) continue;

        const newCtx: RouteCtx = {
          routeAssets: [neibor, ...current.ctx.routeAssets],
          routeIds: [pair.route_id, ...current.ctx.routeIds],
          amount: transaction.amount,
          funds: transaction.funds,
          priceImpact:
            (1 + current.ctx.priceImpact) * (1 + transaction.priceImpact) - 1,
        };

        if (neibor === inputAsset) {
          if (!bestRoute || Number(bestRoute.funds) > Number(newCtx.funds)) {
            bestRoute = newCtx;
          }
          continue;
        }

        if (
          newCtx.routeAssets.length < deep ||
          (newCtx.routeAssets.length === deep && neibor === inputAsset)
        ) {
          queue.push({ key: neibor, ctx: newCtx });
        }
      }
    }

    return bestRoute;
  }

  swap(pair: RoutePair, inputAsset: string, inputAmount: number) {
    let dy = 0;
    let priceImpact = 0;
    const dx = +inputAmount * pair.fillPercent;

    let x = pair.baseAmount;
    let y = pair.quoteAmount;
    const inputBaseAsset = inputAsset === pair.base_asset_id;
    if (!inputBaseAsset) {
      [x, y] = [y, x];
    }

    if (pair.swap_method === "curve") {
      dy = curve.swap(x, y, dx);
      dy = new BigNumber(dy)
        .decimalPlaces(precision, BigNumber.ROUND_DOWN)
        .toNumber();
      priceImpact = curve.getPriceImpact(inputAmount, dy);
    } else {
      dy = uniswap.swap(x, y, dx);
      dy = new BigNumber(dy)
        .decimalPlaces(precision, BigNumber.ROUND_DOWN)
        .toNumber();
      priceImpact = uniswap.getPriceImpact(x, y, inputAmount, dy);
    }

    if (dy <= 0) return;

    return {
      funds: inputAmount,
      amount: dy,
      priceImpact,
    };
  }

  swapReverse(pair: RoutePair, inputAsset: string, outputAmount: number) {
    let dx = 0;
    let priceImpact = 0;
    const dy = outputAmount;

    let x = pair.baseAmount;
    let y = pair.quoteAmount;
    const inputBaseAsset = inputAsset === pair.base_asset_id;
    if (!inputBaseAsset) {
      [x, y] = [y, x];
    }

    if (dy > y) return;

    if (pair.swap_method === "curve") {
      dx = curve.swapReverse(x, y, dy);
      dx = new BigNumber(dx / pair.fillPercent)
        .decimalPlaces(precision, BigNumber.ROUND_CEIL)
        .toNumber();
      priceImpact = curve.getPriceImpact(dx, outputAmount);
    } else {
      dx = uniswap.swapReverse(x, y, dy);
      dx = new BigNumber(dx / pair.fillPercent)
        .decimalPlaces(precision, BigNumber.ROUND_CEIL)
        .toNumber();
      priceImpact = uniswap.getPriceImpact(x, y, dx, outputAmount);
    }

    if (dx <= 0) return;

    return {
      funds: dx,
      amount: outputAmount,
      priceImpact,
    };
  }
}
