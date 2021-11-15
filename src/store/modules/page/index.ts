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
    tabIndex: "",
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
    reverse: false,
    sort: "desc",
    dimension: "volume",
    searchHistory: [],
  },

  mine: {
    expandIndex: -1,
  },
};

const mutations = {
  [MutationTypes.SET_POOL_SEARCH_HISTORY](state, value) {
    updateCache(state.pool.searchHistory, value);
  },
  ...make.mutations(state),
};

export default {
  namespaced: true,
  state,
  mutations,
};
