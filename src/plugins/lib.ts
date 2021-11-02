import Vue from "vue";

import Bugsnag from "@bugsnag/js";
import BugsnagPluginVue from "@bugsnag/plugin-vue";
import UIKit from "@foxone/uikit";
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

import "sticksy";
import "@/components";

import "@foxone/uikit/build/index.min.css";

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

  Vue.use(UIKit);
  Vue.use(UIKit.Toast, app.vuetify, {
    top: false,
    centered: true,
  });
  Vue.use(UIKit.Dialog, app.vuetify, { flat: true });
  Vue.use(InfiniteScroll);

  Bugsnag.start({
    apiKey: "06e187390080bca0c4399f731eb5dd50",
    plugins: [new BugsnagPluginVue()],
  });
};

export default plugin;
