import { make } from "vuex-pathify";
import { MutationTypes, ActionTypes } from "./types";
import { PRSID } from "@/constants";

import type { ActionTree } from "vuex";

const state: State.PoolState = {
  pairs: [],
  assets: [],
  assetsWhiteLists: [],
  assetsBlackLists: [PRSID],
  fiats: [],
  cache: [],
  pairsInfo: {
    fee_24h: "",
    volume_24h: "",
    pair_count: 0,
    transaction_count_24h: 0,
    ts: 0,
  },
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

const actions: ActionTree<State.AuthState, any> = {
  async [ActionTypes.LOAD_POOL_ASSETS]({ commit }) {
    const resp = await this.$http.getAssets();

    commit(MutationTypes.SET_ASSETS, resp);
  },

  async [ActionTypes.LOAD_FIATS]({ commit }, { token }) {
    const resp = await this.$http.getFiats(token);

    commit(MutationTypes.SET_FIATS, resp);
  },

  async [ActionTypes.LOAD_POOL_PAIRS]({ commit }, { brokerId }) {
    const resp = await this.$http.getPairs({ brokerId });
    const pairs = resp.pairs || [];
    const pairsInfo = {
      fee_24h: resp.fee_24h,
      volume_24h: resp.volume_24h,
      pair_count: resp.pair_count,
      transaction_count_24h: resp.transaction_count_24h,
      ts: resp.ts,
    };

    commit(MutationTypes.SET_PAIRS, pairs);
    commit(MutationTypes.SET_ASSETS_WHITE_LISTS, resp.whitelists);
    commit(MutationTypes.SET_PAIRS_INFO, pairsInfo);

    this.$pairRoutes.makeRoutes(pairs);
  },
};

export default {
  state,
  mutations,
  actions,
};
