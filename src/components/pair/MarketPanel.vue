<template>
  <div v-if="pair">
    <pair-price :pair="pair" :data="data" class="mt-4" />

    <pair-informations :pair="pair" :data="data" class="mt-6" />

    <div class="label-1 mt-8">{{ $t("chart") }}</div>
    <market-chart-panel :pair="pair" class="mt-4" @loaded="handleLoaded" />

    <div class="label-1 mt-8">{{ $t("pool.assets") }}</div>
    <pair-assets :pair="pair" class="mt-4" />

    <div class="label-1 mt-8 mb-4 d-flex">
      <span>{{ $t("transactions") }}</span>
    </div>
    <pair-transactions :pair="pair" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PairPrice from "@/components/pair/PairPrice.vue";
import PairInformations from "@/components/pair/PairInformations.vue";
import PairAssets from "@/components/pair/PairAssets.vue";
import PairTransactions from "@/components/pair/PairTransactions.vue";
import MarketChartPanel from "@/components/chart/market-chart/MarketChartPanel.vue";
import RouteToMyHistoryAction from "./RouteToMyHistoryAction.vue";
import { Get } from "vuex-pathify";
import { GlobalGetters } from "@/store/types";

@Component({
  components: {
    PairPrice,
    PairAssets,
    PairInformations,
    PairTransactions,
    MarketChartPanel,
    RouteToMyHistoryAction,
  },
})
class MarketPanel extends Vue {
  @Prop() pair;

  @Get(GlobalGetters.LOGGED) isLogged!: boolean;

  data = {
    kline: [],
    market: [],
  };

  handleLoaded(data) {
    this.data = data;
  }
}
export default MarketPanel;
</script>
