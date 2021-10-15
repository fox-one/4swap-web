import { make } from "vuex-pathify";
import { MutationTypes, ActionTypes, GetterTypes } from "./types";
import { PRSID } from "@/constants";
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
    const cache = state.cache;
    const index = cache.indexOf(key);

    if (index > -1) {
      state.cache.splice(index, 1);
    } else if (cache.length >= 20) {
      state.cache.shift();
    }

    state.cache.push(key);
  },
};

const getters = {
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

    return { totalUSDValue, volume24h, fee24h, transactions };
  },

  [GetterTypes.GET_ASSET_BY_ID](state) {
    return (id: string) => state.assets.find((x) => x.id === id);
  },
};

const actions: ActionTree<State.AuthState, any> = {
  async [ActionTypes.LOAD_POOL_ASSETS]({ commit }) {
    const resp = await this.$http.getAssets();

    commit(MutationTypes.SET_ASSETS, resp.assets);
  },

  async [ActionTypes.LOAD_FIATS]({ commit }, { token }) {
    const resp = await this.$http.getFiats({ token });

    commit(MutationTypes.SET_FIATS, resp);
  },

  async [ActionTypes.LOAD_POOL_PAIRS]({ commit }, { brokerId }) {
    const resp = await this.$http.getPairs({ brokerId });
    const pairs = resp.pairs || [];

    commit(MutationTypes.SET_PAIRS, pairs);
    commit(MutationTypes.SET_ASSETS_WHITE_LISTS, resp.whitelists);

    this.$pairRoutes.makeRoutes(pairs);
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
