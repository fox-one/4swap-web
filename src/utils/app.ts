export async function initApp(vm: Vue) {
  if (vm.$route.name === "auth") {
    return;
  }
  const store = vm.$store;
  const inited = store.state.app.inited;
  if (!inited) {
    store.commit("app/SET_INITING", true);
  }
  try {
    await Promise.all([
      store.dispatch("global/loadFiats", { token: vm.$config.FIAT_TOKEN }),
      store.dispatch("global/loadAssets"),
      vm.$utils.helper.loadWalletAssets(vm),
      store.dispatch("global/getAllAddedPairs", {
        brokerId: vm.$config.BROKER_ID,
      }),
      store.dispatch("global/getMe"),
      store.dispatch("global/getAppInfo"),
    ]);
    store.commit("app/SET_INITING", false);
    store.commit("app/SET_INITED", true);
  } catch (error) {
    store.commit("app/SET_INITING", false);
  }
}

export function genAppTasks(vm: Vue) {
  let $interval: any = "";

  return {
    setUpPollingTasks() {
      this.clearPollingTasks();
      $interval = setInterval(() => {
        vm.$store.dispatch("global/getAllAddedPairs", {
          brokerId: vm.$config.BROKER_ID,
        });
      }, 3000);
    },
    clearPollingTasks() {
      clearInterval($interval);
    },
  };
}
