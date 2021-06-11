import { MutationTree } from "vuex";

const state = () => ({
  expandIndex: -1,
  historyExpandIndex: -1,
  ascending: false,
  sortby: "totalValue",
  filter: "",
});

export type SwapState = {
  expandIndex: number;
  historyExpandIndex: number;
  ascending: boolean;
  sortby: string;
  filter: string;
};

const mutations: MutationTree<SwapState> = {
  SET_EXPAND_INDEX(state, value) {
    state.expandIndex = value;
  },
  SET_HISTORY_EXPAND_INDEX(state, value) {
    state.historyExpandIndex = value;
  },
  SET_ASCENDING(state, value) {
    state.ascending = !!value;
  },
  SET_SORTBY(state, value) {
    state.sortby = value;
  },
  SET_FILTER(state, value) {
    state.filter = value || "";
  },
};

export default {
  state,
  mutations,
};
