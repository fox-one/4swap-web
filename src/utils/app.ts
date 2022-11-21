import { GlobalActions, GlobalGetters } from "@/store/types";
import { loadAccountData, sync } from "./account";
import { TERMS_VERSION, GLOBAL_EVENTS } from "@/constants";

export async function init(vm: Vue) {
  const { dispatch } = vm.$store;

  dispatch(GlobalActions.LOAD_POOL_DATA, { brokerId: vm.$config.BROKER_ID });

  try {
    await sync(vm);
    await loadAccountData(vm);
  } catch (error) {
    // ignore 401
    console.log(error);
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

export function checkTerms(vm: Vue) {
  const termsAccepted = vm.$store.state.app.termsAccepted;
  const termsVersion = vm.$store.state.app.termsVersion;

  if (!termsAccepted || termsVersion !== TERMS_VERSION) {
    vm.$root.$emit(GLOBAL_EVENTS.OPEN_TERMS_MODAL);
  }
}
