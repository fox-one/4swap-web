declare namespace State {
  export interface PoolState {
    pairs: API.Pair[];
    assets: API.Asset[];
    assetsWhiteLists: string[];
    assetsBlackLists: string[];
    fiats: API.Fiat[];
    cache: string[];
    pairsInfo: API.PairsInfo;
  }
}
