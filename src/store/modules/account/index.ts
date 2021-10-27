import Vue from "vue";
import { make } from "vuex-pathify";
import { ActionTypes, MutationTypes, GetterTypes } from "./types";
import { fmtProfits } from "@/utils/profits";

import type { ActionTree, GetterTree } from "vuex";

const state: State.AccountState = {
  profile: null,
  assets: [],
  profits: {},
};

const getters: GetterTree<State.AccountState, any> = {
  [GetterTypes.USER_ID](state) {
    return state.profile?.user_id;
  },

  [GetterTypes.GET_WALLET_BALANCE](state) {
    return state.assets.reduce((total, next) => {
      return total + +next.price_usd * +next.balance;
    }, 0);
  },

  [GetterTypes.GET_BALANCE_BY_ID](state) {
    return (id: string) => {
      return state.assets?.find((asset) => asset.asset_id === id)?.balance ?? 0;
    };
  },

  [GetterTypes.GET_PROFIT_BY_PAIR](state) {
    return (pair) => {
      const key = `${pair.base_asset_id}_${pair.quote_asset_id}`;
      const data = state.profits[key];

      if (data) {
        return fmtProfits(pair, state.profits[key]);
      }

      return null;
    };
  },
};

const mutations = {
  ...make.mutations(state),

  [MutationTypes.SET_WALLET_ASSETS](state, data) {
    state.assets = data;
  },

  [MutationTypes.SET_WALLET_ASSET](state, data) {
    const index = state.assets.find((x) => x.asset_id === data.asset_id);

    if (index > -1) {
      Vue.set(state.assets, index, data);
    }
  },

  [MutationTypes.SET_PROFIT](state, { base, quote, data }) {
    const key = `${base}_${quote}`;

    Vue.set(state.profits, key, data);
  },

  [MutationTypes.CLEAR_ACCOUNT](state) {
    state.profile = null;
    state.assets = [];
  },
};

const actions: ActionTree<State.AccountState, any> = {
  async [ActionTypes.LOAD_PROFILE]({ commit }) {
    const resp = await this.$http.getMe();

    commit(MutationTypes.SET_PROFILE, resp);
  },

  async [ActionTypes.LOAD_PROFIT]({ commit }, { base, quote }) {
    const resp = await this.$http.getProfits({ base, quote });

    commit(MutationTypes.SET_PROFIT, { base, quote, data: resp });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
