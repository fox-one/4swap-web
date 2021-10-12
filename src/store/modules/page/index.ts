import { make } from "vuex-pathify";

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
  },

  mine: {
    expandIndex: -1,
  },
};

const mutations = {
  ...make.mutations(state),
};

export default {
  state,
  mutations,
};
