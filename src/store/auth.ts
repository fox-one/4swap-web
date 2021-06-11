import { MutationTree, GetterTree, ActionTree } from "vuex";
import { SCOPE } from "~/types";

const state = () => ({
  token: "",
  scope: "",
  fennecToken: "",
});

export type AuthState = {
  token: string;
  scope: string;
  fennecToken: string;
};

const getters: GetterTree<AuthState, any> = {
  isLogged(state) {
    return Boolean(state.token) || Boolean(state.fennecToken);
  },
  getToken(state) {
    return state.token;
  },
  canReadAsset(state) {
    return state.scope.indexOf(SCOPE.ASSETS_READ) > -1;
  },
};

const mutations: MutationTree<AuthState> = {
  SET_TOKEN(state, data: { token: string; scope: string }) {
    state.token = data.token;
    state.scope = data.scope;
  },
  SET_FENNEC_TOKEN(state, data: { token: string; scope: string }) {
    state.fennecToken = data.token;
  },
};

const actions: ActionTree<AuthState, any> = {
  async login({ commit }, code) {
    const res = await this.$http.auth(code);
    commit("SET_TOKEN", { token: res.token, scope: res.scope });
  },

  logout({ commit }) {
    commit("SET_TOKEN", { token: "", scope: "" });
  },
};

export default {
  getters,
  state,
  mutations,
  actions,
};
