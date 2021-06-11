export async function initApp(vue: Vue) {
  if (vue.$route.name === "auth") {
    return;
  }
  const store = vue.$store;
  const inited = store.state.app.inited;
  if (!inited) {
    store.commit("app/SET_INITING", true);
  }
  try {
    await Promise.all([
      store.dispatch("global/loadFiats"),
      store.dispatch("global/loadAssets"),
      vue.$utils.helper.loadWalletAssets(vue),
      store.dispatch("global/getAllAddedPairs"),
      store.dispatch("global/getMe"),
      store.dispatch("global/getAppInfo"),
    ]);
    store.commit("app/SET_INITING", false);
    store.commit("app/SET_INITED", true);
  } catch (error) {
    store.commit("app/SET_INITING", false);
  }
}

export function genAppTasks(vue: Vue) {
  let $interval: any = "";

  return {
    setUpPollingTasks() {
      this.clearPollingTasks();
      $interval = setInterval(() => {
        vue.$store.dispatch("global/getAllAddedPairs");
      }, 3000);
    },
    clearPollingTasks() {
      clearInterval($interval);
    },
  };
}
