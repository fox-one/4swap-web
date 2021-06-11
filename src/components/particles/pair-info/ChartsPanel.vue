<template>
  <div class="mt-5 px-4">
    <div class="f-title-1 f-greyscale-1 mb-3">
      {{ $t("chart") }}
    </div>
    <f-panel class="pa-0 mt-5">
      <v-layout class="pa-3">
        <v-flex>
          <base-chart-duration-selector
            v-if="!durationDisabled"
            v-model="duration"
            :durations="meta.durations"
          />
        </v-flex>
        <base-chart-type-selector
          v-model="chartType"
          :types="meta.chartTypes"
        />
      </v-layout>
      <v-divider />
      <div class="chart-wrap">
        <div v-if="loading" class="loading-wrap">
          <f-loading :loading="loading" size="24" width="2" class="pa-5" />
        </div>
        <template v-else>
          <liquidity-chart
            v-if="chartType === 'liquidity'"
            :data="marketDataInDuration"
          />
          <volume-chart
            v-else-if="chartType === 'volume'"
            :data="marketDataInDuration"
          />
          <price-chart
            v-else
            :data="klineDateInDuration"
            :reverse="chartType === '1'"
          />
        </template>
      </div>
    </f-panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import VolumeChart from "@/components/charts/Volume.vue";
import LiquidityChart from "@/components/charts/Liquidity.vue";
import PriceChart from "@/components/charts/Price.vue";
import parse from "parse-duration";

export type ChartType = "liquidity" | "volume" | "0" | "1";

@Component({
  components: {
    VolumeChart,
    LiquidityChart,
    PriceChart,
  },
})
class ChartsPanel extends Vue {
  @Prop() baseAsset!: API.Asset | null;

  @Prop() quoteAsset!: API.Asset | null;

  @Prop({ default: false, type: Boolean }) durationDisabled!: boolean;

  @Prop({ default: "168h", type: String }) defaultDuration!: API.Duration;

  @Prop({ default: "liquidity", type: String }) defaultChartType!: ChartType;

  duration: API.Duration = this.defaultDuration;

  chartType: ChartType = this.defaultChartType;

  marketData: API.MarketData[] = [];

  klineData: API.KlineData[] = [];

  loading = false;

  get marketDataInDuration() {
    const end = this.marketData[this.marketData.length - 1]?.ts;
    const start = end - (parse(this.duration, "s") || 0);
    if (!start) return [];
    return this.marketData.filter((x) => x.ts >= start);
  }

  get klineDateInDuration() {
    const end = this.klineData[this.klineData.length - 1]?.[0];
    const start = end - (parse(this.duration, "s") || 0);
    if (!start) return [];
    return this.klineData.filter((x) => x[0] >= start);
  }

  get meta() {
    const durations = ["168h", "720h", "4320h"];
    const chartTypes = [
      {
        icon: this.$icons.mdiWater,
        text: this.$t("chart.chart-type.liquidity"),
        value: "liquidity",
      },
      {
        icon: this.$icons.mdiChartBar,
        text: this.$t("chart.chart-type.volume"),
        value: "volume",
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
      const baseSymbol = base.symbol;
      const quoteSymbol = quote.symbol;
      chartTypes.push({
        icon: this.$icons.mdiChartLine,
        text: `${baseSymbol}/${quoteSymbol}`,
        value: "0",
      });
      chartTypes.push({
        icon: this.$icons.mdiChartLine,
        text: `${quoteSymbol}/${baseSymbol}`,
        value: "1",
      });
    }

    return {
      cacheKey,
      base,
      quote,
      symbol,
      durations,
      chartTypes,
    };
  }

  async mounted() {
    if (this.durationDisabled) {
      this.duration = "4320h";
    }
    await this.requestMarketData();
    if (this.meta.base && this.meta.quote) {
      await this.requestKlineData();
    }
    // calcualte ror
    // 7 days
    const len = this.klineData.length;
    const priceRatios: Array<number> = [];
    const liqSums: Array<number> = [];
    const volSums: Array<number> = [];
    [24, 168, 720].forEach((val) => {
      const days = this.klineData.slice(len - val);
      if (days.length) {
        const priceRatio =
          parseFloat(days[days.length - 1][2]) / parseFloat(days[0][2]);

        const periodVols = this.marketData.slice(
          this.marketData.length - val / 24
        );

        const vol = periodVols.reduce((prev, next) => {
          return prev + parseFloat(next.volume);
        }, 0);
        const liq = periodVols.reduce((prev, next) => {
          return prev + parseFloat(next.value);
        }, 0);
        priceRatios.push(priceRatio);
        volSums.push(vol);
        liqSums.push(liq);
      }
    });

    this.$store.commit("global/SET_PRICE_RATIOS", priceRatios);
    this.$store.commit("global/SET_VOL_SUMS", volSums);
    this.$store.commit("global/SET_LIQ_SUMS", liqSums);
  }

  async requestMarketData() {
    const key = `market-${this.meta.cacheKey}`;
    const cache = this.$cache.get(key);
    if (cache) {
      this.marketData = cache;
      return;
    }
    this.loading = true;
    const dur: API.Duration = "4320h";
    try {
      const params = {
        base: this.meta.base?.id ?? "",
        quote: this.meta.quote?.id ?? "",
        dur,
      };
      const res = await this.$http.getMarketData(params);
      this.marketData = res;
      this.$cache.set(key, res);
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
    this.loading = false;
  }

  async requestKlineData() {
    const key = `kline-${this.meta.cacheKey}`;
    const cache = this.$cache.get(key);
    if (cache) {
      this.klineData = cache;
      return;
    }
    this.loading = true;
    const dur: API.Duration = "4320h";
    try {
      const params = {
        base: this.meta.base?.id ?? "",
        quote: this.meta.quote?.id ?? "",
        dur,
      };
      const res = await this.$http.getKlineData(params);
      this.klineData = res;
      this.$cache.set(key, res);
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }

    this.loading = false;
  }
}
export default ChartsPanel;
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
