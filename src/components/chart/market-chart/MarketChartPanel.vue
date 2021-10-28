<template>
  <div class="chart-panel pa-4">
    <div class="chart-type">
      <type-select :pair="pair" :value.sync="chartType" />
    </div>
    <div class="chart-title mb-10">
      <price-title-section v-if="isPriceChart" :current="current" />
      <market-title-section v-else :current="current" />
    </div>
    <div class="chart">
      <component
        :is="component"
        :data="chartData"
        :loading="loading"
        :colors="colors"
        :current.sync="current"
        :chart-type="chartType"
      />
    </div>
    <div class="chart-duration">
      <duration-select :value.sync="duration" />
    </div>
    <div v-if="isPriceChart" class="chart-action">
      <route-to-swap-action
        :pair="pair"
        :reverse="isPriceReverse"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import TypeSelect from "../TypeSelect.vue";
import DurationSelect from "../DurationSelect.vue";
import PriceChart from "./PriceChart.vue";
import LiquidityChart from "./LiquidityChart.vue";
import VolumeChart from "./VolumeChart.vue";
import MarketTitleSection from "./MarketTitleSection.vue";
import PriceTitleSection from "./PriceTitleSection.vue";
import RouteToSwapAction from "../../liquidity/RouteToSwapAction.vue";
import parse from "parse-duration";

export type ChartType = "liquidity" | "volume" | "0" | "1";

const getDurationData = (data, duration, fn) => {
  const end = fn(data[data.length - 1]);
  const start = end - (parse(duration, "s") || 0);
  if (!start) return [];

  return data.filter((x) => fn(x) >= start);
};

@Component({
  components: {
    MarketTitleSection,
    PriceTitleSection,
    TypeSelect,
    DurationSelect,
    PriceChart,
    LiquidityChart,
    VolumeChart,
    RouteToSwapAction,
  },
})
class MarketChartPanel extends Vue {
  @Prop() pair;

  loading = false;

  duration: API.Duration = "168h";

  chartType: ChartType = "volume";

  data: any = {
    market: [],
    kline: [],
  };

  current = null;

  get isPriceChart() {
    return this.chartType === "0" || this.chartType === "1";
  }

  get isPriceReverse() {
    return this.chartType === "1";
  }

  get durationData() {
    return {
      market: getDurationData(this.data.market, this.duration, (x) => x?.ts),
      kline: getDurationData(this.data.kline, this.duration, (x) => x?.[0]),
    };
  }

  get component() {
    switch (this.chartType) {
      case "liquidity":
        return "liquidity-chart";
      case "volume":
        return "volume-chart";
      case "0":
      case "1":
        return "price-chart";
      default:
        return "";
    }
  }

  get chartData() {
    switch (this.chartType) {
      case "liquidity":
      case "volume":
        return this.durationData.market;
      case "0":
      case "1":
        return this.durationData.kline;
      default:
        return [];
    }
  }

  get colors() {
    const primary = this.$vuetify.theme.currentTheme.secondary as string;
    const disabled = this.$vuetify.theme.currentTheme.third as string;
    const text = this.$vuetify.theme.currentTheme.greyscale_4 as string;

    return [primary, disabled, text];
  }

  mounted() {
    this.requestChartData();
  }

  async requestChartData() {
    this.loading = true;
    try {
      const params: any = {
        base: this.pair?.base_asset_id ?? "",
        quote: this.pair?.quote_asset_id ?? "",
        dur: "4320h",
      };

      const [market, kline] = await Promise.all([
        this.$http.getMarketData(params),
        this.$http.getKlineData(params),
      ]);

      this.data.market = market;
      this.data.kline = kline;
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
    this.loading = false;
  }
}
export default MarketChartPanel;
</script>

<style lang="scss" scoped>
.chart-panel {
  background: #edfbfc;
  border-radius: 8px;

  .chart {
    height: 195px;
  }
}
</style>
