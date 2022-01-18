import { make } from "vuex-pathify";
import { MutationTypes, ActionTypes, GetterTypes } from "./types";
import { PRSID } from "@/constants";
import { updateCache } from "@/utils/cache";
import BigNumber from "bignumber.js";

import type { ActionTree } from "vuex";

const state: State.PoolState = {
  pairs: [],
  assets: [],
  assetsWhiteLists: [],
  assetsBlackLists: [PRSID],
  fiats: [],
  cache: [],
};

const mutations = {
  ...make.mutations(state),

  [MutationTypes.PUT_CACHE](state, key) {
    updateCache(state.cache, key);
  },
};

const getters = {
  // filter assets by whitelist and blacklist
  [GetterTypes.AVALIABLE_ASSETS](state) {
    const {
      assets,
      assetsWhiteLists: whitelists,
      assetsBlackLists: blacklists,
    } = state;
    let avaliables = assets;

    //  use asset only listed in whitelist
    if (whitelists.length) {
      avaliables = avaliables.filter(({ id }) =>
        whitelists.find((x) => id === x)
      );
    }

    // remove asset listed in blacklist
    if (blacklists.length) {
      avaliables = avaliables.filter(
        ({ id }) => !blacklists.find((x) => id === x)
      );
    }

    return avaliables;
  },

  // filter pairs only contain assets in avaliable assets
  [GetterTypes.AVALIABLE_PAIRS](state, getters) {
    const pairs = state.pairs;
    const assets = getters[GetterTypes.AVALIABLE_ASSETS];

    return pairs.filter(({ base_asset_id, quote_asset_id }) => {
      return (
        assets.find(({ id }) => id === base_asset_id) &&
        assets.find(({ id }) => id === quote_asset_id)
      );
    });
  },

  // only assets appear in pairs can be swapped
  [GetterTypes.AVALIABLE_SWAP_ASSETS](state, getters) {
    const assets: API.Asset[] = getters[GetterTypes.AVALIABLE_ASSETS];
    const avaliablePairs: API.Pair[] = getters[GetterTypes.AVALIABLE_PAIRS];

    const set = new Set<string>();
    const map = new Map<string, API.Asset>();

    assets.forEach((x) => {
      map.set(x.id, x);
    });

    avaliablePairs.forEach((x) => {
      set.add(x.base_asset_id);
      set.add(x.quote_asset_id);
    });

    const avaliableAssets = Array.from(set).map((x) => map.get(x));
    const cache = state.cache.concat().reverse();

    return avaliableAssets.concat().sort((a, b) => {
      const idxA = cache.indexOf(a?.id);
      const idxB = cache.indexOf(b?.id);

      return idxA > idxB ? -1 : idxA === idxB ? 0 : 1;
    });
  },

  [GetterTypes.POOL_OVERVIEW](_, getters) {
    const pairs = getters[GetterTypes.AVALIABLE_PAIRS];
    const { totalUSDValue, volume24h, fee24h, transactions } = pairs.reduce(
      ({ totalUSDValue, volume24h, fee24h, transactions }, p) => {
        return {
          totalUSDValue: totalUSDValue.plus(p.base_value).plus(p.quote_value),
          volume24h: volume24h.plus(p.volume_24h),
          fee24h: fee24h.plus(p.fee_24h),
          transactions: transactions.plus(p.transaction_count_24h ?? 0),
        };
      },
      {
        totalUSDValue: new BigNumber(0),
        volume24h: new BigNumber(0),
        fee24h: new BigNumber(0),
        transactions: new BigNumber(0),
      }
    );
    const turnover24h = volume24h / totalUSDValue;

    return { totalUSDValue, volume24h, fee24h, transactions, turnover24h };
  },

  [GetterTypes.GET_ASSET_BY_ID](state) {
    return (id: string) => state.assets.find((x) => x.id === id);
  },

  [GetterTypes.GET_ASSET_BY_SYMBOL](state) {
    return (symbol: string) => {
      return state.assets.find((x) => {
        return [
          x.symbol.toLowerCase(),
          x.display_symbol?.toLowerCase(),
        ].includes(symbol.toLowerCase());
      });
    };
  },

  [GetterTypes.GET_PAIR_BY_IDS](state) {
    return (id1: string, id2: string) => {
      // pair's base id is smaller than quote id
      const [base, quote] = id1 < id2 ? [id1, id2] : [id2, id1];

      return state.pairs.find(({ base_asset_id, quote_asset_id }) => {
        return base === base_asset_id && quote === quote_asset_id;
      });
    };
  },

  [GetterTypes.GET_PAIR_BY_LIQUIDIY_ID](state) {
    return (id: string) => {
      return state.pairs.find(({ liquidity_asset_id }) => {
        return liquidity_asset_id === id;
      });
    };
  },

  [GetterTypes.GET_PAIRS_BY_ASSET](state, getters) {
    const pairs = getters[GetterTypes.AVALIABLE_PAIRS];

    return (id: string) => {
      return pairs.filter((x) => {
        return x.base_asset_id === id || x.quote_asset_id === id;
      });
    };
  },
};

const actions: ActionTree<State.AuthState, any> = {
  async [ActionTypes.LOAD_POOL_ASSETS]({ commit }) {
    const resp = await this.$http.getAssets();

    commit(
      MutationTypes.SET_ASSETS,
      resp.assets.map((x) => ({
        ...x,
        chainLogo: x.chain.logo,
      }))
    );
  },

  async [ActionTypes.LOAD_FIATS]({ commit }, { token }) {
    const resp = await this.$http.getFiats({ token });

    commit(MutationTypes.SET_FIATS, resp);
  },

  async [ActionTypes.LOAD_POOL_PAIRS]({ commit }, { brokerId }) {
    const resp = await this.$http.getPairs({ brokerId });
    const pairs = resp?.pairs ?? [];

    if (pairs.length > 0) {
      commit(MutationTypes.SET_PAIRS, pairs);
      commit(MutationTypes.SET_ASSETS_WHITE_LISTS, resp.whitelists ?? []);

      this.$pairRoutes.makeRoutes(pairs);
    }
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
