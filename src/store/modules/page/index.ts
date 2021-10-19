import { make } from "vuex-pathify";
import { MutationTypes } from "./types";
import { updateCache } from "@/utils/cache";

const state: State.PageState = {
  liqAdd: {
    base: null,
    quote: null,
    deposits: [],
  },

  swap: {
    inputAsset: null,
    outputAsset: null,
  },

  pool: {
    sortby: "",
    filter: "",
    ascending: false,
    searchHistory: [],
  },

  mine: {
    expandIndex: -1,
  },
};

const mutations = {
  [MutationTypes.SET_POOL_SEARCH_HISTORY](state, value) {
    updateCache(state, value);
  },
  ...make.mutations(state),
};

export default {
  namespaced: true,
  state,
  mutations,
};
