import { make } from "vuex-pathify";
import { MutationTypes, ActionTypes, GetterTypes } from "./types";

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
    state.scope = data.scope;
  },

  [MutationTypes.CLEAR_AUTH](state) {
    state.token = "";
    state.scope = "";
    state.channel = "";
  },
};

const actions: ActionTree<State.AuthState, any> = {
  async [ActionTypes.LOGIN]({ commit }, { code, broker_id, label }) {
    const resp = await this.$http.auth({ code, broker_id, label });

    commit(MutationTypes.SET_TOKEN, { token: resp.token, scope: resp.scope });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
