declare namespace State {
  export interface PoolState {
    pairs: API.Pair[];
    assets: API.Asset[];
    multisigAssets: API.MixinAsset[];
    assetsWhiteLists: string[];
    assetsBlackLists: string[];
    assetsHideLists: string[];
    fiats: API.Fiat[];
    cache: string[];
    loading: boolean;
  }
}
