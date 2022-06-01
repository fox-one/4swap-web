import { make } from "vuex-pathify";
import { MutationTypes } from "./types";
import { updateCache } from "@/utils/cache";

const state = {
  liqAdd: {
    base: null,
    quote: null,
    deposits: [],
  },

  pairDetail: {
    tabIndex: 0,
    pair_information_expand: false,
  },

  swap: {
    input: {
      asset: null,
      amount: "",
    },
    output: {
      asset: null,
      amount: "",
    },
  },

  pool: {
    tabIndex: 0,
    reverse: false,
    sort_pair: "desc",
    dimension_pair: "volume",
    sort_asset: "desc",
    dimension_asset: "price",
    search_history: [],
  },

  mine: {
    expandIndex: -1,
  },

  asset: {
    tabIndex: 0,
  },
};

const mutations = {
  [MutationTypes.SET_POOL_SEARCH_HISTORY](state, data) {
    updateCache(state.pool.search_history, data);
  },
  [MutationTypes.CLEAR_POOL_SEARCH_HISTORY](state) {
    state.pool.search_history = [];
  },
  ...make.mutations(state),
};

export default {
  namespaced: true,
  state,
  mutations,
};
