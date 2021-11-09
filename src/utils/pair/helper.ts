import { GlobalGetters } from "@/store/types";
import { format } from "@foxone/utils/number";
import { Curve, A } from "../swap/curve";

export type PairMeta = ReturnType<typeof getPairMeta>;

export type PairShared = ReturnType<typeof getPairShared>;

export type AccountPair = API.Pair & {
  profit: API.PairProfits;
  shared: PairShared;
};

const curve = new Curve(A);

export function getCurvePairPrice(pair: API.Pair, reverse = false) {
  if (reverse) {
    return curve.swapReverse(+pair.base_amount, +pair.quote_amount, 1);
  }

  return curve.swap(+pair.base_amount, +pair.quote_amount, 1);
}

export function getUniPairPrice(pair: API.Pair, reverse = false) {
  if (reverse) {
    return +pair.quote_amount && +pair.base_amount / +pair.quote_amount;
  }

  return +pair.base_amount && +pair.quote_amount / +pair.base_amount;
}

export function getPairPrice(pair: API.Pair, reverse = false) {
  return pair.swap_method === "curve"
    ? getCurvePairPrice(pair, reverse)
    : getUniPairPrice(pair, reverse);
}

/**
 * get pair meta items
 * base and quote should be ajusted by priorities
 * finally order is decide by params reverse and priorities
 *
 * @export
 * @param {Vue} vm
 * @param {API.Pair} pair
 * @param {boolean} [reverse=false]
 * @return {*}
 */
export function getPairMeta(vm: Vue, pair: API.Pair, reverse = false) {
  if (!pair) {
    return null;
  }

  const getAssetById = vm.$store.getters[GlobalGetters.GET_ASSET_BY_ID];
  const priorities = ["XIN", "ETH", "BTC", "DAI", "USDC", "pUSD", "USDT"];

  const baseAsset: API.Asset = getAssetById(pair.base_asset_id);
  const quoteAsset: API.Asset = getAssetById(pair.quote_asset_id);
  const liquidityAsset: API.Asset = getAssetById(pair.liquidity_asset_id);
  const baseIndex = priorities.findIndex((x) => x === baseAsset?.symbol);
  const quoteIndex = priorities.findIndex((x) => x === quoteAsset?.symbol);

  // reverse or not is decide by params and priorities
  const isReverse = quoteIndex < baseIndex !== reverse;

  const sorted = isReverse
    ? { baseAsset: quoteAsset, quoteAsset: baseAsset, ...getReversePair(pair) }
    : { baseAsset, quoteAsset, ...pair };

  const price = getPairPrice(sorted, false);
  const reversePrice = getPairPrice(sorted, true);

  const symbol = `${sorted.baseAsset.symbol} / ${sorted.quoteAsset.symbol}`;
  const volume = +pair.quote_value + +pair.base_value;
  const turnOver = (volume && +pair.volume_24h / +volume) || 0;

  // price format
  const baseSymbol = sorted.baseAsset.symbol;
  const quoteSymbol = sorted.quoteAsset.symbol;

  const priceFormat = format({ n: price, fixed: true, dp: 8 });
  const reversePriceFormat = format({ n: reversePrice, fixed: true, dp: 8 });
  const priceText = `1 ${baseSymbol} ≈ ${priceFormat} ${quoteSymbol}`;
  const reversePriceText = `1 ${quoteSymbol} ≈ ${reversePriceFormat} ${baseSymbol}`;

  return {
    ...sorted,
    liquidityAsset,
    price,
    reversePrice,
    symbol,
    volume,
    turnOver,
    isReverse,
    priceText,
    reversePriceText,
  };
}

/**
 * method to calc a single pair share amount and percent in pool
 * percent equals balance of liquidity asset / pair liquidity
 *
 * @export
 * @param {Vue} vm
 * @param {API.Pair} pair
 * @return {*}
 */
export function getPairShared(getters, pair: API.Pair) {
  const getAssetById = getters[GlobalGetters.GET_ASSET_BY_ID];
  const getBalanceById = getters[GlobalGetters.GET_BALANCE_BY_ID];
  const baseAsset = getAssetById(pair.base_asset_id);
  const quoteAsset = getAssetById(pair.quote_asset_id);
  const balance = getBalanceById(pair.liquidity_asset_id) ?? 0;

  if (!balance) {
    return null;
  }

  const liquidity = Number(pair?.liquidity ?? 0);
  const percent = liquidity > 0 ? Math.min(balance / liquidity, 1) : 0;

  const totalBaseAmount = Number(pair?.base_amount ?? 0);
  const totalQuoteAmount = Number(pair?.quote_amount ?? 0);

  const sharedBaseAmount = totalBaseAmount * percent;
  const sharedQuoteAmount = totalQuoteAmount * percent;
  const totalValue =
    sharedBaseAmount * Number(baseAsset?.price ?? 0) +
    sharedQuoteAmount * Number(quoteAsset?.price ?? 0);

  return { balance, totalValue, sharedBaseAmount, sharedQuoteAmount, percent };
}

/**
 * switch base and quote asset data
 *
 * @export
 * @param {API.Pair} pair
 * @return {*}
 */
export function getReversePair(pair: API.Pair) {
  return {
    ...pair,
    base_amount: pair.quote_amount,
    base_asset_id: pair.quote_asset_id,
    base_value: pair.quote_value,
    quote_amount: pair.base_amount,
    quote_asset_id: pair.base_asset_id,
    quote_value: pair.base_value,
  };
}

/**
 * calc price, fee, min receive... by prediction order
 *
 * @export
 * @param {Vue} vm
 * @param {{
 *     input: API.Asset;
 *     output: API.Asset;
 *     order: API.SwapOrder;
 *   }} {
 *     input,
 *     output,
 *     order,
 *   }
 * @return {*}
 */
export function getPreOrderMeta(
  vm: Vue,
  {
    input,
    output,
    order,
  }: {
    input: API.Asset;
    output: API.Asset;
    order: API.SwapOrder;
  }
) {
  const format = vm.$utils.number.format;
  const getPairByIds = vm.$store.getters[GlobalGetters.GET_PAIR_BY_IDS];

  const inputSymbol = input.symbol;
  const outputSymbol = output.symbol;
  const slippage = vm.$store.state.app.settings.slippage || 0.99;
  const { amount = 0, funds = 0, route_assets = [] } = order;

  // calc price and reverse price text
  let price = "";
  let priceText = "";
  let reversePrice = "";
  let reversePriceText = "";

  if (amount && funds) {
    price = (+amount / +funds).toString();
    reversePrice = (+funds / +amount).toString();
    priceText = `1 ${inputSymbol} ≈ ${format({ n: price })} ${outputSymbol}`;
    reversePriceText = `1 ${outputSymbol} ≈ ${format({
      n: reversePrice,
    })} ${inputSymbol}`;
  }

  // calc fee and fee text
  let fee = 0;
  let feeText = "";
  let receivePercent = 1;

  route_assets.forEach((asset, index) => {
    const pair = getPairByIds(asset, route_assets?.[index + 1]);

    receivePercent *= 1 - (pair?.fee_percent ?? 0);
  });

  fee = +funds - receivePercent * +funds;
  feeText = format({ n: fee, dp: 8 });

  // calc min recevied
  const minReceived = +amount * +slippage;
  const minReceivedText = format({ n: minReceived });

  return {
    ...order,
    price,
    priceText,
    reversePrice,
    reversePriceText,
    fee,
    feeText,
    minReceived,
    minReceivedText,
  };
}

/**
 * filter pair by given filter string
 *
 * @export
 * @param {string} str
 * @param {PairMeta} pair
 * @return {*}
 */
export function filterFn(str: string, pair: PairMeta) {
  const baseSymbol = pair?.baseAsset.symbol.toLowerCase() ?? "";
  const quoteSymbol = pair?.quoteAsset.symbol.toLowerCase() ?? "";
  const pairSymbol = pair?.symbol.toLowerCase() ?? "";
  const baseName = pair?.baseAsset.name.toLocaleLowerCase() ?? "";
  const quoteName = pair?.quoteAsset.name.toLocaleLowerCase() ?? "";
  const filter = str.toLowerCase();

  if (!str) return false;

  return (
    baseSymbol.includes(filter) ||
    quoteSymbol.includes(filter) ||
    pairSymbol.includes(filter) ||
    baseName.includes(filter) ||
    quoteName.includes(filter)
  );
}

/**
 * get ROR data by kline and market data
 *
 * @export
 * @param {API.Pair} pair
 * @param {{ kline: API.KlineData[]; market: API.MarketData[] }} data
 * @param {number} days
 * @return {*}
 */
export function getNetRORInDuration(
  pair: API.Pair,
  data: { kline: API.KlineData[]; market: API.MarketData[] },
  days: number
) {
  // kline data is recorded by 1 hour interval
  // market data is recorded by 1 day interval
  const kline = data.kline.slice(data.kline.length - days * 24);
  const market = data.market.slice(data.market.length - days);

  const ratio = +kline[kline.length - 1][2] / +kline[0][2];
  const volume = market.reduce((total, next) => total + +next.volume, 0);
  const totalLiquidity = +pair.base_value + +pair.quote_value;
  const losses = (2 * Math.sqrt(ratio)) / (1 + ratio) - 1;
  const margins = (volume * +pair.fee_percent) / totalLiquidity;

  return losses + margins;
}

/**
 * get price change in duration
 *
 * @export
 * @param {{ kline: API.KlineData[]; market: API.MarketData[] }} data
 * @param {number} days
 * @return {*}
 */
export function getPriceChangeInDuration(kline: API.KlineData[], days: number) {
  const current = kline?.[kline.length - 1]?.[2] ?? 0;

  const startIndex = kline.length >= days * 24 ? kline.length - days * 24 : 0;
  const start = kline?.[startIndex]?.[2] ?? 0;

  if (!start) {
    return 0;
  }

  return +current / +start - 1;
}

export function getMostLiquidityPair(vm: Vue) {
  return vm.$store.getters[GlobalGetters.AVALIABLE_PAIRS].sort((a, b) => {
    const va = getPairMeta(vm, a)?.volume ?? 0;
    const vb = getPairMeta(vm, b)?.volume ?? 0;

    return vb - va;
  })[0];
}
