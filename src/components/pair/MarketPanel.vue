<template>
  <div v-if="pair">
    <pair-price :pair="pair" />

    <f-divider class="my-6 mx-n3" />

    <pair-informations :pair="pair" :data="data" />

    <div class="label-1 mt-8">{{ $t("pool.added-assets") }}</div>
    <pair-assets :pair="pair" class="mt-4" />

    <div class="label-1 mt-8">{{ $t("chart") }}</div>
    <market-chart-panel :pair="pair" class="mt-4" @loaded="handleLoaded" />

    <div class="label-1 mt-8">{{ $t("transactions") }}</div>
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

@Component({
  components: {
    PairPrice,
    PairAssets,
    PairInformations,
    PairTransactions,
    MarketChartPanel,
  },
})
class MarketPanel extends Vue {
  @Prop() pair;

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
