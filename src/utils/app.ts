import { GlobalMutations, GlobalActions, GlobalGetters } from "@/store/types";
import { loadAccountData } from "./account";

export async function init(vm: Vue) {
  const { commit, dispatch } = vm.$store;

  commit(GlobalMutations.SET_APP_INITING, true);

  try {
    // load public application data
    await Promise.all([
      dispatch(GlobalActions.LOAD_APP_INFO),
      dispatch(GlobalActions.LOAD_FIATS, { token: vm.$config.FIAT_TOKEN }),
      dispatch(GlobalActions.LOAD_POOL_ASSETS),
      dispatch(GlobalActions.LOAD_POOL_PAIRS, {
        brokerId: vm.$config.BROKER_ID,
      }),
    ]);

    try {
      if (vm.$route.name === "auth") {
        commit(GlobalMutations.SET_APP_INITING, false);

        return;
      }

      await vm.$utils.account.checkFennecAuth(vm);

      // load account data
      await loadAccountData(vm);
    } catch (error) {
      // ignore 401
    }

    commit(GlobalMutations.SET_APP_INITING, false);
  } catch (error) {
    vm.$utils.helper.errorHandler(vm, error);
  }
}

let interval: any = "";

export const tasks = {
  setUpPollingTasks(vm: Vue) {
    this.clearPollingTasks();

    interval = setInterval(() => {
      vm.$store.dispatch(GlobalActions.LOAD_POOL_PAIRS, {
        brokerId: vm.$config.BROKER_ID,
      });

      if (vm.$store.getters[GlobalGetters.LOGGED]) {
        vm.$utils.assets.getAssets(vm);
      }
    }, 15000);
  },

  clearPollingTasks() {
    clearInterval(interval);
  },
};
