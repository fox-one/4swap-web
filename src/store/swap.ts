import { MutationTree } from "vuex";

const state = () => ({
  inputAsset: null,
  outputAsset: null,
  expandIndex: -1,
});

export type SwapState = {
  inputAsset: API.Asset | null;
  outputAsset: API.Asset | null;
  expandIndex: number;
};

const mutations: MutationTree<SwapState> = {
  SET_INPUT_ASSET(state, data) {
    state.inputAsset = data;
  },
  SET_OUTPUT_ASSET(state, data) {
    state.outputAsset = data;
  },
  SET_EXPAND_INDEX(state, value) {
    state.expandIndex = value;
  },
};

export default {
  state,
  mutations,
};
