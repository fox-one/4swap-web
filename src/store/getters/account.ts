import { getAvaliableAddAssets } from "@/utils/assets";
import { getPairShared } from "@/utils/pair/helper";
import { GlobalGetters } from "../types";
import { GetterTypes } from "./types";

export default {
  [GetterTypes.AVALIABLE_ADD_ASSETS](state) {
    const walletAssets: API.MixinAsset[] = state.account.assets;
    const assets: API.Asset[] = state.pool.assets;
    const assetsBlackLists: string[] = state.pool.assetsBlackLists;

    return getAvaliableAddAssets(assets, walletAssets, assetsBlackLists);
  },

  [GetterTypes.GET_ACCOUNT_PAIR](state, getters) {
    return (pair) => {
      const shared = getPairShared(getters, pair);
      const profit = getters[GlobalGetters.GET_PROFIT_BY_PAIR](pair);

      return { ...pair, shared, profit };
    };
  },

  [GetterTypes.ACCOUNT_PAIRS](state, getters) {
    const pairs = getters[GlobalGetters.AVALIABLE_PAIRS];

    return pairs
      .map((pair) => getters[GlobalGetters.GET_ACCOUNT_PAIR](pair))
      .filter((pair) => pair.shared);
  },

  [GetterTypes.ACCOUNT_OVERVIEW](state, getters) {
    const pairs = getters[GlobalGetters.ACCOUNT_PAIRS];

    return pairs.reduce(
      (total, next) => {
        return {
          totalUsd: total.totalUsd + (next.shared?.totalValue ?? 0),
          totalProfit: total.totalProfit + (next.profit?.fiatProfit ?? 0),
        };
      },
      { totalUsd: 0, totalProfit: 0 }
    );
  },
};
