import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
  createPersistedState({
    key: "vuex",
    paths: [
      "app.inited",
      "app.notShowDevAlertAgain",
      "app.settings",
      "auth.token",
      "auth.scope",
      "global",
      "pool",
      "swap.inputAsset",
      "swap.outputAsset",
      "liquidity",
    ],
  })(store);
};
