export interface Asset {
  id: string;
  name: string;
  symbol: string;
  logo: string;
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

  assets.forEach(({ id, name, symbol, logo, price }) => {
    checkDup({ id, name, symbol, logo, price });
  });

  mixinAssets.forEach(
    ({ asset_id: id, name, symbol, icon_url: logo, price_usd: price }) => {
      checkDup({ id, name, symbol, logo, price });
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
