import { getAvaliableAddAssets } from "@/utils/assets";
import { getPairShared } from "@/utils/pair/helper";
import { GlobalGetters } from "../types";
import { GetterTypes } from "./types";

export default {
  [GetterTypes.AVALIABLE_ADD_ASSETS](state) {
    const walletAssets: API.MixinAsset[] = state.account.assets;
    const assets: API.Asset[] = state.pool.assets;
    const assetsBlackLists: string[] = state.pool.assetsBlackLists;
    const multisigAssets: API.MixinAsset[] = state.pool.multisigAssets;

    return getAvaliableAddAssets(
      assets,
      walletAssets,
      assetsBlackLists,
      multisigAssets
    );
  },

  [GetterTypes.GET_IS_LIQUIDITY_ADDED](state, getters) {
    return (vm: Vue, pair) => {
      const accountPairs = getters[GetterTypes.ACCOUNT_PAIRS](vm);
      const found = accountPairs.find((x) => {
        return (
          x.base_asset_id === pair.base_asset_id &&
          x.quote_asset_id === pair.quote_asset_id
        );
      });

      return Boolean(found);
    };
  },

  [GetterTypes.GET_ACCOUNT_PAIR](state, getters) {
    return (vm: Vue, pair) => {
      const shared = getPairShared(vm, pair);
      const profit = getters[GlobalGetters.GET_PROFIT_BY_PAIR](vm, pair);

      return { ...pair, shared, profit };
    };
  },

  [GetterTypes.ACCOUNT_PAIRS](state, getters) {
    const pairs = getters[GlobalGetters.AVALIABLE_PAIRS];

    return (vm: Vue) => {
      return pairs
        .map((pair) => getters[GlobalGetters.GET_ACCOUNT_PAIR](vm, pair))
        .filter((pair) => pair.shared);
    };
  },

  [GetterTypes.ACCOUNT_OVERVIEW](state, getters) {
    return (vm: Vue) => {
      const pairs = getters[GlobalGetters.ACCOUNT_PAIRS](vm);

      return pairs.reduce(
        (total, next) => {
          return {
            totalUsd: total.totalUsd + (next.shared?.totalValue ?? 0),
            totalProfit: total.totalProfit + (next.profit?.fiatProfit ?? 0),
          };
        },
        { totalUsd: 0, totalProfit: 0 }
      );
    };
  },
};
