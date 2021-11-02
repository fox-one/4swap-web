import { make } from "vuex-pathify";
import { MutationTypes, ActionTypes } from "./types";
import { isDarkTheme } from "@foxone/utils/mixin";

import type { ActionTree } from "vuex";

const state: State.AppState = {
  appbar: {
    title: "",
    style: "",
    show: true,
    back: false,
    extension: null,
    extensionHeight: 48,
  },

  contentClass: "",

  contentStyle: {},

  settings: {
    slippage: 0.99,
    currency: "USD",
    chartScheme: "SCHEME_A",
    priceAlertCountDown: true,
  },

  paying: {
    visible: false,
    timer: -1,
  },

  appInfo: null,

  dark: isDarkTheme(),

  bottomNav: "",

  initing: true,
};

const mutations = {
  ...make.mutations(state),

  [MutationTypes.SET_PAYING](state, data) {
    state.paying = { ...state.paying, ...data };
  },

  [MutationTypes.SET_APP_INITING](state, value) {
    state.initing = value;
  },

  [MutationTypes.SET_CONTENT_STYLE](state, value) {
    state.contentStyle = value;
  },

  [MutationTypes.SET_SETTINGS](state, data) {
    state.settings = { ...state.settings, ...data };
  },

  [MutationTypes.SET_APPBAR](state, data) {
    state.appbar = {
      title: "",
      style: "",
      show: true,
      back: true,
      extension: null,
      extensionHeight: 48,
      ...data,
    };
  },
};

const actions: ActionTree<State.AppState, any> = {
  async [ActionTypes.LOAD_APP_INFO]({ commit }) {
    const resp = await this.$http.getAppInfo();

    commit(MutationTypes.SET_APP_INFO, resp);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
