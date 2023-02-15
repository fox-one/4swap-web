import { GlobalGetters, GlobalMutations } from "@/store/types";

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  chainId: string;
  chainLogo: string;
  price: string;
}

/**
 * get assets that could be seleted in liquidity add page
 * which assets pool support and listed in mixin wallet
 * specially assets listed in blacklist is banned
 *
 * @export
 * @param {API.Asset[]} assets
 * @param {API.MixinAsset[]} mixinAssets
 * @param {string[]} blacklist
 * @return {*}
 */
export function getAvaliableAddAssets(
  assets: API.Asset[],
  mixinAssets: API.MixinAsset[],
  blacklist: string[]
) {
  const assetsMap = new Map<string, Asset>();

  const checkDup = (asset: Asset) => {
    if (blacklist.includes(asset.id)) {
      return;
    }

    if (asset.name.toLowerCase().includes("lp token")) {
      return;
    }

    if (!assetsMap[asset.id]) {
      assetsMap.set(asset.id, asset);
    }
  };

  assets.forEach(({ id, name, symbol, logo, price, chainLogo, chain_id }) => {
    checkDup({ id, name, symbol, logo, price, chainLogo, chainId: chain_id });
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
        chainId: chain_id,
        chainLogo: chainAsset?.icon_url ?? "",
      });
    }
  );

  return Array.from(assetsMap.values());
}

export async function getAssets(vm: Vue) {
  if (vm.$store.getters[GlobalGetters.LOGGED]) {
    try {
      const assets = await vm.$passport.getAssets();

      if (assets?.length > 0) {
        vm.$store.commit(GlobalMutations.SET_WALLET_ASSETS, assets);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export async function getAsset(vm: Vue, id: string) {
  if (vm.$store.getters[GlobalGetters.LOGGED]) {
    const asset = await vm.$passport.getAsset(id);

    vm.$store.commit(GlobalMutations.SET_WALLET_ASSET, asset);
  }
}
