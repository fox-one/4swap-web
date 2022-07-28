import { make } from "vuex-pathify";
import { MutationTypes, GetterTypes } from "./types";

import type { ActionTree, GetterTree } from "vuex";

const state: State.AuthState = {
  token: "",
  scope: "",
  channel: "",
};

const getters: GetterTree<State.AuthState, any> = {
  [GetterTypes.LOGGED](state) {
    return Boolean(state.token);
  },
};

const mutations = {
  ...make.mutations(state),

  [MutationTypes.SET_TOKEN](state, data) {
    state.token = data.token;
    state.channel = data.channel;
  },

  [MutationTypes.CLEAR_AUTH](state) {
    state.token = "";
    state.channel = "";
  },
};

const actions: ActionTree<State.AuthState, any> = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
