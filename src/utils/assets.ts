import { GlobalGetters, GlobalMutations } from "@/store/types";
import { EOSID, ETHID } from "~/constants";

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
  blacklist: string[],
  multisigAssets: API.MixinAsset[]
) {
  const assetsMap = new Map<string, Asset>();

  const checkDup = (asset: Asset) => {
    if (blacklist.includes(asset.id)) {
      return;
    }

    if (asset.name.includes("LP Token")) {
      return;
    }

    // asset should be a ERC20 Token or eosio.token,
    // otherwise it should be supported with multisignature API.
    if (
      asset.chainId !== ETHID &&
      asset.chainId !== EOSID &&
      !multisigAssets.find(({ asset_id }) => asset_id === asset.id)
    ) {
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

/**
 * get wallet assets by mixin api or fennec
 * depend on which method user authed
 *
 * @export
 * @param {Vue} vm
 */
export async function getAssets(vm: Vue) {
  let assets: API.MixinAsset[] = [];

  if (vm.$fennec.connected) {
    assets = (await vm.$fennec.ctx?.wallet.getAssets()) ?? [];
  } else {
    const resp = await vm.$http.getAssetsFromMixin();

    assets = resp ?? [];
  }

  if (vm.$store.getters[GlobalGetters.LOGGED]) {
    vm.$store.commit(GlobalMutations.SET_WALLET_ASSETS, assets);
  }
}

/**
 * get wallet asset by mixin api or fennec
 * depend on which method user authed
 *
 * @export
 * @param {Vue} vm
 */
export async function getAsset(vm: Vue, id: string) {
  let asset: API.MixinAsset;

  if (vm.$fennec.connected) {
    asset = (await vm.$fennec.ctx?.wallet.getAsset(id)) ?? [];
  } else {
    const resp = await vm.$http.getAssetFromMixin(id);

    asset = resp;
  }

  if (asset && vm.$store.getters[GlobalGetters.LOGGED]) {
    vm.$store.commit(GlobalMutations.SET_WALLET_ASSET, asset);
  }
}
