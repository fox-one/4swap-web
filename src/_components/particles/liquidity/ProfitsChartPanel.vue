<template>
  <f-panel class="pa-0 mt-5">
    <v-layout class="pa-3">
      <v-flex>
        <base-chart-duration-selector
          v-model="duration"
          :durations="durations"
        />
      </v-flex>
      <base-chart-type-selector v-model="chartType" :types="meta.chartTypes" />
    </v-layout>
    <v-divider />
    <div class="chart-wrap">
      <div v-if="loading" class="loading-wrap">
        <f-loading :loading="loading" size="24" width="2" class="pa-5" />
      </div>
      <template v-else-if="profitsData.length === 0">
        <base-empty-section />
      </template>
      <template v-else>
        <profit-chart
          v-if="chartType === 'profit'"
          :data="profitsDataInDuration"
        />
        <fiat-profit-chart
          v-if="chartType === 'fiat-profit'"
          :data="profitsDataInDuration"
        />
      </template>
    </div>
  </f-panel>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ProfitChart from "@/components/charts/Profit.vue";
import FiatProfitChart from "@/components/charts/FiatProfit.vue";
import parse from "parse-duration";
import { Getter } from "vuex-class";

export type ChartType = "profit" | "fiat-profit";

@Component({
  components: {
    ProfitChart,
    FiatProfitChart,
  },
})
class ProfitsChartPanel extends Vue {
  @Prop() baseAsset!: API.Asset;

  @Prop() quoteAsset!: API.Asset;

  @Prop({ default: "168h", type: String }) defaultDuration!: API.Duration;

  @Prop({ default: "profit", type: String }) defaultChartType!: ChartType;

  @Getter("global/getPair") getPair;

  loading = false;

  profitsData: API.PairProfits[] = [];

  duration: API.Duration = this.defaultDuration;

  chartType: ChartType = this.defaultChartType;

  durations = ["168h", "720h", "4320h"];

  get profitsDataInDuration() {
    const end = this.profitsData[this.profitsData.length - 1]?.ts;
    const start = end - (parse(this.duration, "s") || 0);
    if (!start) return [];
    return this.profitsData.filter((x) => x.ts >= start);
  }

  get meta() {
    const chartTypes = [
      {
        icon: this.$icons.mdiCurrencyUsd,
        text: this.$t("chart.chart-type.fiat-profit"),
        value: "fiat-profit",
      },
      {
        icon: this.$icons.mdiCurrencyBtc,
        text: this.$t("chart.chart-type.profit"),
        value: "profit",
      },
    ];

    let base: API.Asset | null = null;
    let quote: API.Asset | null = null;
    let symbol = "";
    let cacheKey = "";
    if (this.baseAsset && this.quoteAsset) {
      [base, quote] = [this.baseAsset, this.quoteAsset].sort((a, b) =>
        a.id > b.id ? 1 : -1
      );
      symbol = `${base.symbol}/${quote.symbol}`;
      cacheKey = `${base.id}/${quote.id}`;
    }
    return {
      chartTypes,
      symbol,
      cacheKey,
    };
  }

  mounted() {
    this.requestProfitsHistory();
  }

  async requestProfitsHistory() {
    const key = `profits-history-${this.meta.cacheKey}`;
    const cache = this.$cache.get(key);
    if (cache) {
      this.profitsData = cache;
      return;
    }
    this.loading = true;
    try {
      const base = this.baseAsset.id;
      const quote = this.quoteAsset.id;
      const pair = this.getPair({ base, quote });
      const res = await this.$http.getProfitsHistory(pair, {
        base,
        quote,
        dur: "4320h",
      });
      this.profitsData = res;
      this.$cache.set(key, res);
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
    this.loading = false;
  }
}
export default ProfitsChartPanel;
</script>

<style lang="scss" scoped>
.chart-wrap {
  height: 220px;
}

.loading-wrap {
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
