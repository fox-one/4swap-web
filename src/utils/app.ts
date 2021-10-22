import { GlobalMutations, GlobalActions, GlobalGetters } from "@/store/types";
import { loadAccountData } from "./account";

export async function init(vm: Vue) {
  const { commit, dispatch } = vm.$store;

  if (vm.$route.name === "auth") {
    return;
  }

  commit(GlobalMutations.SET_APP_INITING, true);

  await vm.$utils.account.checkFennecAuth(vm);

  try {
    await Promise.all([
      // load basic application data
      dispatch(GlobalActions.LOAD_APP_INFO),
      dispatch(GlobalActions.LOAD_FIATS, { token: vm.$config.FIAT_TOKEN }),
      dispatch(GlobalActions.LOAD_POOL_ASSETS),
      dispatch(GlobalActions.LOAD_POOL_PAIRS, {
        brokerId: vm.$config.BROKER_ID,
      }),

      // load account data
      loadAccountData(vm),
    ]);

    commit(GlobalMutations.SET_APP_INITING, false);
  } catch (error) {
    commit(GlobalMutations.SET_APP_INITING, false);
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
    }, 5000);
  },

  clearPollingTasks() {
    clearInterval(interval);
  },
};
