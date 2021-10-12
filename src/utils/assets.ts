import { GlobalGetters, GlobalMutations } from "@/store/types";

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  chainLogo: string;
  price: string;
}

export function getLiquidityAddAvaliableAssets(
  assets: API.Asset[],
  mixinAssets: API.MixinAsset[],
  blacklist: string[]
) {
  const assetsMap = new Map<string, Asset>();

  const checkDup = (asset: Asset) => {
    if (blacklist.includes(asset.id)) {
      return;
    }

    if (asset.name.includes("LP Token")) {
      return;
    }

    if (!assetsMap[asset.id]) {
      assetsMap.set(asset.id, asset);
    }
  };

  assets.forEach(({ id, name, symbol, logo, price, chainLogo }) => {
    checkDup({ id, name, symbol, logo, price, chainLogo });
  });

  mixinAssets.forEach(
    ({
      asset_id: id,
      name,
      symbol,
      icon_url: logo,
      price_usd: price,
      chain_id,
    }) => {
      const chainAsset = mixinAssets.find((x) => x.asset_id === chain_id);

      checkDup({
        id,
        name,
        symbol,
        logo,
        price,
        chainLogo: chainAsset?.icon_url ?? "",
      });
    }
  );

  return Array.from(assetsMap.values());
}

export function getPairShared(vm: Vue, pair: API.Pair) {
  const getAssetById = vm.$store.getters["global/getAssetById"];
  const getBalanceById = vm.$store.getters["global/getBalanceByAssetId"];
  const baseAsset = getAssetById(pair.base_asset_id);
  const quoteAsset = getAssetById(pair.quote_asset_id);
  const balance = getBalanceById(pair.liquidity_asset_id) ?? 0;

  const s = balance;
  const k = Number(pair?.liquidity ?? 0);
  const percent = k > 0 ? Math.min(s / k, 1) : 0;

  const totalBaseAmount = Number(pair?.base_amount ?? 0);
  const totalQuoteAmount = Number(pair?.quote_amount ?? 0);

  const sharedBaseAmount = totalBaseAmount * percent;
  const sharedQuoteAmount = totalQuoteAmount * percent;
  const totalValue =
    sharedBaseAmount * Number(baseAsset?.price ?? 0) +
    sharedQuoteAmount * Number(quoteAsset?.price ?? 0);

  return { totalValue, sharedBaseAmount, sharedQuoteAmount, percent };
}

export async function getAssets(vm: Vue) {
  let assets: API.MixinAsset[] = [];

  if (vm.$fennec.connected) {
    assets = (await vm.$fennec.ctx?.wallet.getAssets()) ?? [];
  } else {
    const resp = await vm.$http.getAssetsFromMixin();

    assets = resp;
  }

  if (vm.$store.getters[GlobalGetters.LOGGED]) {
    vm.$store.commit(GlobalMutations.SET_WALLET_ASSETS, assets);
  }
}

export async function getAsset(vm: Vue, id: string) {
  let asset: API.MixinAsset;

  if (vm.$fennec.connected) {
    asset = (await vm.$fennec.ctx?.wallet.getAsset(id)) ?? [];
  } else {
    const resp = await vm.$http.getAssetFromMixin(id);

    asset = resp;
  }

  if (vm.$store.getters[GlobalGetters.LOGGED]) {
    vm.$store.commit(GlobalMutations.SET_WALLET_ASSET, asset);
  }
}
