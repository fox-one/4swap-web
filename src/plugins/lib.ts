import Vue from "vue";
import "animate.css";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginVue from "@bugsnag/plugin-vue";
import UIKit from "@foxone/uikit";
import InfiniteScroll from "vue-infinite-scroll";
import VeLine from "v-charts/lib/line.common";
import VeBar from "v-charts/lib/bar.common";
import VeCandle from "v-charts/lib/candle.common";
import "echarts/lib/component/markLine";

Vue.use(UIKit);
Vue.use(InfiniteScroll);
Vue.component(VeLine.name, VeLine);
Vue.component(VeBar.name, VeBar);
Vue.component(VeCandle.name, VeCandle);

Bugsnag.start({
  apiKey: "06e187390080bca0c4399f731eb5dd50",
  plugins: [new BugsnagPluginVue()],
});
