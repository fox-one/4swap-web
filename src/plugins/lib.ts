import Vue from "vue";

import Bugsnag from "@bugsnag/js";
import BugsnagPluginVue from "@bugsnag/plugin-vue";
import UIKit from "@foxone/uikit";
import Passport from "@foxone/mixin-passport";
import PandoUI from "@foxone/pando-ui";
import InfiniteScroll from "vue-infinite-scroll";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  LegendPlainComponent,
  AxisPointerComponent,
} from "echarts/components";
import { use } from "echarts/core";

import "@/components";
import "@foxone/uikit/build/index.min.css";
import "@foxone/pando-ui/build/index.css";

import type { Plugin } from "@nuxt/types";

const plugin: Plugin = ({ app }) => {
  use([
    CanvasRenderer,
    LineChart,
    BarChart,
    GridComponent,
    TooltipComponent,
    LegendPlainComponent,
    VisualMapComponent,
    AxisPointerComponent,
  ]);

  Vue.use(UIKit, {
    vuetify: app.vuetify,
    dialog: { flat: true },
    toast: { top: false, centered: true },
    auth: {
      wallets: ["fennec", "mixin", "metamask", "walletconnect"],
      clientId: app.$config.MIXIN_CLIENT_ID,
      scope: "PROFILE:READ ASSETS:READ",
      pkce: true,
    },
  });
  Vue.use(Passport, { origin: app.$config.CHANNEL_NAME });
  Vue.use(PandoUI, app.vuetify);
  Vue.use(InfiniteScroll);

  Bugsnag.start({
    apiKey: "06e187390080bca0c4399f731eb5dd50",
    plugins: [new BugsnagPluginVue()],
  });
};

export default plugin;
