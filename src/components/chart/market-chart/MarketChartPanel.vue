<template>
  <base-chart-panel-layout
    :types="types"
    :type.sync="chartType"
    :duration.sync="duration"
  >
    <template name="title">
      <price-title-section v-if="isPriceChart" :current="current" />
      <market-title-section v-else :current="current" />
    </template>
    <template name="chart">
      <component
        :is="component"
        :data="chartData"
        :loading="loading"
        :colors="colors"
        :current.sync="current"
        :chart-type="chartType"
      />
      <template name="foot">
        <route-to-swap-action
          v-if="isPriceChart"
          :pair="pair"
          :reverse="isPriceReverse"
          class="mt-4"
        />
      </template>
    </template>
  </base-chart-panel-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import PriceChart from "./PriceChart.vue";
import LiquidityChart from "./LiquidityChart.vue";
import VolumeChart from "./VolumeChart.vue";
import MarketTitleSection from "./MarketTitleSection.vue";
import PriceTitleSection from "./PriceTitleSection.vue";
import RouteToSwapAction from "../../liquidity/RouteToSwapAction.vue";
import BaseChartPanelLayout from "../BaseChartPanelLayout.vue";

export type ChartType = "liquidity" | "volume" | "0" | "1";

@Component({
  components: {
    BaseChartPanelLayout,
    MarketTitleSection,
    PriceTitleSection,
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
    const getDurationData = this.$utils.helper.getDurationData;

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

  get types() {
    const baseItems = [
      { text: this.$t("chart.chart-type.volume"), value: "volume" },
      { text: this.$t("chart.chart-type.liquidity"), value: "liquidity" },
    ];

    if (this.pair) {
      const pairMeta = this.$utils.pair.getPairMeta(this, this.pair)!;
      const { baseAsset, quoteAsset } = pairMeta;
      const symbol = `${baseAsset.symbol} / ${quoteAsset.symbol}`;
      const reverseSymbol = `${quoteAsset.symbol} / ${baseAsset.symbol}`;
      const priceItems = [
        { text: this.$t("price") + ` (${symbol})`, value: "0" },
        { text: this.$t("price") + ` (${reverseSymbol})`, value: "1" },
      ];

      return [...baseItems, ...priceItems];
    }

    return baseItems;
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
