/* eslint-disable @typescript-eslint/no-unused-vars */
import { Plugin } from "@nuxt/types";
import createHttpService from "~/services/http/create";
import utils from "@/utils";
import { PairRoutes } from "@/utils/pair/route";
import Fennec from "@foxone/fennec-dapp";

declare module "vue/types/vue" {
  interface Vue {
    $utils: typeof utils;
    $http: ReturnType<typeof createHttpService>;
    $pairRoutes: PairRoutes;
    $fennec: Fennec;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $utils: typeof utils;
    $http: ReturnType<typeof createHttpService>;
    $pairRoutes: PairRoutes;
  }
}

declare module "vuex/types/index" {
  interface Store<S> {
    $utils: typeof utils;
    $http: ReturnType<typeof createHttpService>;
    $pairRoutes: PairRoutes;
  }
}

const plugin: Plugin = ({ app, $config }, inject) => {
  inject("http", createHttpService(app, $config.API_BASE));
  inject("utils", utils);
  inject("pairRoutes", new PairRoutes());
  inject("fennec", new Fennec());
};

export default plugin;
