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
