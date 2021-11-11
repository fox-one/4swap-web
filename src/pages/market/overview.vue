<template>
  <div>
    <market-informations />

    <f-divider opacity="0.2" class="mt-5 mb-8" />
    <div class="label-1">{{ $t("chart") }}</div>
    <market-chart-panel is-global class="mt-4" />

    <div class="label-1 mt-8">{{ $t("transactions") }}</div>
    <market-transactions />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import MarketInformations from "@/components/market/MarketInformations.vue";
import MarketTransactions from "@/components/market/MarketTransactions.vue";
import MarketChartPanel from "@/components/chart/market-chart/MarketChartPanel.vue";

@Component({
  components: {
    MarketInformations,
    MarketTransactions,
    MarketChartPanel,
  },
})
class MarketPage extends Mixins(mixins.page) {
  get title() {
    return this.$t("overview") as string;
  }
}
export default MarketPage;
</script>
