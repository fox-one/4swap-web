<template>
  <profit-chart-panel-layout
    :types="types"
    :type.sync="type"
    :duration.sync="duration"
    :title="titles.title"
    :subtitle="titles.subtitle"
    :thumb-title="titles.thumbTitle"
    :expand="expand2"
    :loading="loading"
    @toggle="togggleExpand2"
  >
    <template #thumb>
      <profit-rate-chart-thumb
        :loading="loading"
        :data="thumbData"
        :current.sync="thumbCurrent"
        :type="type"
        :colors="colors"
        :pair="pair"
      />
    </template>
    <template #chart>
      <profit-rate-chart
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
import {
  Component,
  Vue,
  Prop,
  InjectReactive,
  Inject,
} from "vue-property-decorator";
import ProfitChartPanelLayout from "../ProfitChartPanelLayout.vue";
import ProfitRateChart from "./ProfitRateChart.vue";
import ProfitRateChartThumb from "./ProfitRateChartThumb.vue";

@Component({
  components: {
    ProfitChartPanelLayout,
    ProfitRateChart,
    ProfitRateChartThumb,
  },
})
class ProfitRateChartPanel extends Vue {
  @Prop() data!: API.PairProfits[];

  @Prop() loading;

  @Prop() pair;

  @InjectReactive()
  expand2;

  @Inject()
  togggleExpand2;

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
        text: this.$t("profits.rate") + ` (${this.meta.baseAssetSymbol})`,
        value: 0,
      },
      {
        text: this.$t("profits.rate") + ` (${this.meta.quoteAssetSymbol})`,
        value: 1,
      },
      {
        text: this.$t("profits.rate") + ` (${this.meta.currency})`,
        value: 2,
      },
    ];
  }

  get titles() {
    const toPercent = this.$utils.number.toPercent;

    const time = this.current?.[0] ?? 0;
    const data = this.current?.[1] ?? 0;
    const thumbData = this.thumbCurrent?.[1] ?? 0;

    const title = (data && `${toPercent({ n: data })}`) || "";
    const thumbTitle = (thumbData && `${toPercent({ n: thumbData })}`) || "";
    const subtitle =
      (time && this.$utils.time.format(time, "MMM DD HH:mm A Z")) || "";

    return {
      title,
      subtitle,
      thumbTitle,
    };
  }
}
export default ProfitRateChartPanel;
</script>
