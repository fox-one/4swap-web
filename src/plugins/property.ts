/* eslint-disable @typescript-eslint/no-unused-vars */
import { Plugin } from "@nuxt/types";
import createHttpService from "~/services/http/create";
import utils from "@/utils";
import Cache from "@/utils/cache";
import { PairRoutes } from "@/utils/pair/route";
import Fennec from "@foxone/fennec-dapp";

declare module "vue/types/vue" {
  interface Vue {
    $utils: typeof utils;
    $http: ReturnType<typeof createHttpService>;
    $icons: typeof utils.icons;
    $pairRoutes: PairRoutes;
    $cache: Cache;
    $fennec: Fennec;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $utils: typeof utils;
    $http: ReturnType<typeof createHttpService>;
    $icons: typeof utils.icons;
    $pairRoutes: PairRoutes;
    $cache: Cache;
  }
}

declare module "vuex/types/index" {
  interface Store<S> {
    $utils: typeof utils;
    $http: ReturnType<typeof createHttpService>;
    $icons: typeof utils.icons;
    $pairRoutes: PairRoutes;
    $cache: Cache;
  }
}

const plugin: Plugin = ({ app, $config }, inject) => {
  inject("http", createHttpService(app, $config.API_BASE));
  inject("cache", new Cache());
  inject("utils", utils);
  inject("pairRoutes", new PairRoutes());
  inject("fennec", new Fennec());
};

export default plugin;
