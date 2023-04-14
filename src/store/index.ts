import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules";
import getters from "./getters";
import pathify from "vuex-pathify";
import createPersistedState from "vuex-persistedstate";

// options
pathify.options.mapping = "standard";
pathify.options.deep = 2;

export default function () {
  Vue.use(Vuex);

  return new Vuex.Store({
    modules,
    getters,
    plugins: [
      pathify.plugin,
      createPersistedState({
        key: "vuex",
        paths: [
          "app.version",
          "app.settings",
          "app.termsAccepted",
          "app.termsVersion",
          "auth",
          "account.profile",
          "page.pairDetail.pair_information_expand",
          "page.swap.input.asset",
          "page.swap.output.asset",
          "page.pool.search_history",
          "page.pool.reverse",
          "page.pool.tabIndex",
          "page.pool.sort_pair",
          "page.pool.dimension_pair",
          "page.pool.sort_asset",
          "page.pool.dimension_asset",
          "pool.cache",
          "pool.fiats",
          "pool.assets",
          "account.assets",
          "account.multisigAssets",
        ],
      }),
    ],
  });
}
