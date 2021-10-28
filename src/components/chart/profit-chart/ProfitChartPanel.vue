<template>
  <profit-chart-panel-layout
    :types="types"
    :type.sync="type"
    :duration.sync="duration"
  >
    <template #thumb-title>
      <chart-title-thumb :pair="pair" :current="thumbCurrent" :type="type" />
    </template>
    <template #thumb-chart>
      <profit-chart-thumb
        :loading="loading"
        :data="thumbData"
        :current.sync="thumbCurrent"
        :type="type"
        :colors="colors"
        :pair="pair"
      />
    </template>
    <template #title>
      <chart-title :pair="pair" :current="current" :type="type" />
    </template>
    <template #chart>
      <profit-chart
        :loading="loading"
        :data="durationData"
        :current.sync="current"
        :type="type"
        :colors="colors"
        :pair="pair"
      />
    </template>
  </profit-chart-panel-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ProfitChartPanelLayout from "../ProfitChartPanelLayout.vue";
import ProfitChart from "./ProfitChart.vue";
import ProfitChartThumb from "./ProfitChartThumb.vue";
import ChartTitle from "./ChartTitle.vue";
import ChartTitleThumb from "./ChartTitleThumb.vue";

@Component({
  components: {
    ProfitChart,
    ProfitChartThumb,
    ChartTitle,
    ChartTitleThumb,
    ProfitChartPanelLayout,
  },
})
class ProfitChartPanel extends Vue {
  @Prop() data!: API.PairProfits[];

  @Prop() loading;

  @Prop() pair;

  type = 0;

  current = null;

  thumbCurrent = null;

  duration = "168h";

  get durationData() {
    const getDurationData = this.$utils.helper.getDurationData;

    return getDurationData(this.data, this.duration, (x) => x?.ts);
  }

  get thumbData() {
    const getDurationData = this.$utils.helper.getDurationData;

    return getDurationData(this.data, "24h", (x) => x?.ts);
  }

  get meta() {
    const getPairMeta = this.$utils.pair.getPairMeta;
    const { baseAsset, quoteAsset } = getPairMeta(this, this.pair)!;
    const currency = this.$store.state.app.settings.currency;

    return {
      baseAssetSymbol: baseAsset.symbol,
      quoteAssetSymbol: quoteAsset.symbol,
      currency,
    };
  }

  get colors() {
    const primary = this.$vuetify.theme.currentTheme.primary as string;
    const disabled = this.$vuetify.theme.currentTheme.third as string;
    const text = this.$vuetify.theme.currentTheme.greyscale_4 as string;

    return [primary, disabled, text];
  }

  get types() {
    return [
      {
        text: this.$t("profits") + ` (${this.meta.baseAssetSymbol})`,
        value: 0,
      },
      {
        text: this.$t("profits") + ` (${this.meta.quoteAssetSymbol})`,
        value: 1,
      },
      {
        text: this.$t("profits") + ` (${this.meta.currency})`,
        value: 2,
      },
    ];
  }
}
export default ProfitChartPanel;
</script>
