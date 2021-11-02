declare namespace State {
  export interface SwapAssetData {
    asset: API.Asset | null;
    amount: string;
  }

  export interface PageState {
    liqAdd: {
      base: API.Asset | null;
      quote: API.Asset | null;
      deposits: any;
    };

    swap: {
      input: SwapAssetData;
      output: SwapAssetData;
    };

    pool: {
      sortby: string;
      filter: string;
      ascending: boolean;
      searchHistory: string[];
    };

    mine: {
      expandIndex: number;
    };
  }
}
