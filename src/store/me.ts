import { MutationTree } from "vuex";

const state = () => ({
  filter: "",
});

export type MeState = {
  filter: string;
};

const mutations: MutationTree<MeState> = {
  SET_FILTER(state, value) {
    state.filter = value || "";
  },
};

export default {
  state,
  mutations,
};
