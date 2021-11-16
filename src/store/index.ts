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
          "app.settings",
          "auth",
          "page.swap.input.asset",
          "page.swap.output.asset",
          "page.pool.searchHistory",
          "page.pool.reverse",
          "page.pool.sort",
          "page.pool.dimension",
        ],
      }),
    ],
  });
}
