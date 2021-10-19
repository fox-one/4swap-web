declare namespace State {
  export interface PageState {
    liqAdd: {
      base: API.Asset | null;
      quote: API.Asset | null;
      deposits: any;
    };

    swap: {
      inputAsset: API.Asset | null;
      outputAsset: API.Asset | null;
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
