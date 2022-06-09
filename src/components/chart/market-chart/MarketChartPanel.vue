<template>
  <div>
    <chart-layout
      :types="types"
      :durations="durations"
      :type.sync="chartType"
      :duration.sync="duration"
      :title="titles.title"
      :subtitle="titles.subtitle"
      :label="titles.label"
    >
      <template #chart>
        <component
          :is="component"
          :data="chartData"
          :loading="loading"
          :colors="colors"
          :current.sync="current"
          :chart-type="chartType"
          :pair="pair"
        />
      </template>
    </chart-layout>

    <chart-layout
      v-if="pair && isPriceChart"
      :durations="durations"
      :duration.sync="priceReverse.duration"
      :title="priceReverseTitles.title"
      :subtitle="priceReverseTitles.subtitle"
      :label="priceReverseTitles.label"
    >
      <template #chart>
        <price-chart
          :data="priceReverseDurationData.kline"
          :loading="loading"
          :colors="colors"
          :current.sync="priceReverse.current"
          :chart-reverse="true"
          :pair="pair"
        />
      </template>
    </chart-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import PriceChart from "./PriceChart.vue";
import LiquidityChart from "./LiquidityChart.vue";
import VolumeChart from "./VolumeChart.vue";
import RouteToSwapAction from "../../liquidity/RouteToSwapAction.vue";
import ChartLayout from "../ChartLayout.vue";

export type ChartType = "liquidity" | "volume" | "price";

@Component({
  components: {
    ChartLayout,
    PriceChart,
    LiquidityChart,
    VolumeChart,
    RouteToSwapAction,
  },
})
class MarketChartPanel extends Vue {
  @Prop() pair;

  @Prop({ type: Boolean, default: false }) isGlobal;

  loading = false;

  duration: API.Duration = "168h";

  chartType: ChartType = "price";

  data: any = {
    market: [],
    kline: [],
  };

  current = null;

  priceReverse = {
    current: null,
    duration: "168h",
  };

  get isPriceChart() {
    return this.chartType === "price";
  }

  get durationData() {
    const getDurationData = this.$utils.helper.getDurationData;

    return {
      market: getDurationData(
        this.data.market,
        this.duration,
        (x) => x?.ts,
        100
      ),
      kline: getDurationData(
        this.data.kline,
        this.duration,
        (x) => x?.[0],
        100
      ),
    };
  }

  get priceReverseDurationData() {
    const getDurationData = this.$utils.helper.getDurationData;

    return {
      market: getDurationData(
        this.data.market,
        this.priceReverse.duration,
        (x) => x?.ts,
        100
      ),
      kline: getDurationData(
        this.data.kline,
        this.priceReverse.duration,
        (x) => x?.[0],
        100
      ),
    };
  }

  get component() {
    switch (this.chartType) {
      case "liquidity":
        return "liquidity-chart";
      case "volume":
        return "volume-chart";
      case "price":
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
      case "price":
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
    const types = [
      { text: this.$t("chart.chart-type.volume"), value: "volume" },
      { text: this.$t("chart.chart-type.liquidity"), value: "liquidity" },
    ];

    if (this.pair) {
      types.unshift({ text: this.$t("price"), value: "price" });
    }

    return types;
  }

  get durations() {
    const durations = ["168h", "720h", "4320h"];

    if (this.chartType === "price") {
      durations.unshift("24h");
    }

    return durations;
  }

  get titles() {
    const time = this.current?.[0] ?? 0;
    const data = this.current?.[1] ?? 0;
    const h = this.$createElement;

    if (!time) {
      return { title: "", subtitle: "" };
    }

    if (this.isPriceChart) {
      const { baseAsset, quoteAsset, symbol } = this.$utils.pair.getPairMeta(
        this,
        this.pair
      )!;
      const baseAssetSymbol = baseAsset?.symbol;
      const quoteAssetSymbol = quoteAsset?.symbol;
      const value = this.$utils.number.format({ n: data });
      return {
        title: `1 ${baseAssetSymbol} ≈ ${value} ${quoteAssetSymbol}`,
        subtitle: this.$utils.time.format(time, "MMM DD, YYYY HH:mm"),
        label: symbol,
      };
    }

    return {
      title: h("base-fiat-division", {
        props: { parts: this.$utils.currency.toFiat(this, { n: data }, true) },
      }),
      subtitle: this.$utils.time.format(time, "MMM DD, YYYY"),
    };
  }

  get priceReverseTitles() {
    if (!this.pair) return null;

    const data = this.priceReverse.current?.[1] ?? 0;
    const time = this.priceReverse.current?.[0] ?? 0;
    const { baseAsset, quoteAsset, symbol } = this.$utils.pair.getPairMeta(
      this,
      this.pair,
      true
    )!;
    const baseAssetSymbol = baseAsset?.symbol;
    const quoteAssetSymbol = quoteAsset?.symbol;
    const value = this.$utils.number.format({ n: data });

    return {
      title: `1 ${baseAssetSymbol} ≈ ${value} ${quoteAssetSymbol}`,
      subtitle: this.$utils.time.format(time, "MMM DD, YYYY HH:mm"),
      label: symbol,
    };
  }

  mounted() {
    if (this.isGlobal) {
      this.chartType = "liquidity";
    }

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

      this.$emit("loaded", this.data);
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
    this.loading = false;
  }
}
export default MarketChartPanel;
</script>
