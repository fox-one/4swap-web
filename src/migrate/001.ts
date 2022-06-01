import { GlobalMutations } from "~/store/types";

const version = 1;

export default {
  migrate: function (vm: Vue) {
    vm.$store.commit(GlobalMutations.CLEAR_POOL_SEARCH_HISTORY);
    vm.$store.commit(GlobalMutations.SET_VERSION, version);
  },
  version,
};
