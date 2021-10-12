import { make } from "vuex-pathify";
import { ActionTypes, MutationTypes, GetterTypes } from "./types";

import type { ActionTree, GetterTree } from "vuex";

const state: State.AccountState = {
  profile: null,
  assets: [],
};

const getters: GetterTree<State.AccountState, any> = {
  [GetterTypes.USER_ID](state) {
    return state.profile?.user_id;
  },
};

const mutations = {
  ...make.mutations(state),

  [MutationTypes.CLEAR_ACCOUNT](state) {
    state.profile = null;
    state.assets = [];
  },
};

const actions: ActionTree<State.AccountState, any> = {
  async [ActionTypes.LOAD_PROFILE]({ commit }) {
    const resp = this.$http.getMe();

    commit(MutationTypes.SET_PROFILE, resp);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
