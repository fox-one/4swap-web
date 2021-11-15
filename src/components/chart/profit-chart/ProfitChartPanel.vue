<template>
  <profit-chart-panel-layout
    :types="types"
    :type.sync="type"
    :duration.sync="duration"
    :title="titles.title"
    :hint="titles.hint"
    :subtitle="titles.subtitle"
    :thumb-title="titles.thumbTitle"
    :thumb-hint="titles.thumbHint"
    :expand="expand1"
    :loading="loading"
    @toggle="togggleExpand1"
  >
    <template #thumb>
      <profit-chart-thumb
        :loading="loading"
        :data="thumbData"
        :current.sync="thumbCurrent"
        :type="type"
        :colors="colors"
        :pair="pair"
      />
    </template>
    <template #chart>
      <profit-chart
        :loading="loading"
        :data="durationData"
        :current.sync="current"
        :duration="duration"
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
  Inject,
  InjectReactive,
} from "vue-property-decorator";
import ProfitChartPanelLayout from "../ProfitChartPanelLayout.vue";
import ProfitChart from "./ProfitChart.vue";
import ProfitChartThumb from "./ProfitChartThumb.vue";

@Component({
  components: {
    ProfitChart,
    ProfitChartThumb,
    ProfitChartPanelLayout,
  },
})
class ProfitChartPanel extends Vue {
  @Prop() data!: API.PairProfits[];

  @Prop() loading;

  @Prop() pair;

  @InjectReactive()
  expand1;

  @Inject()
  togggleExpand1;

  type = 0;

  current = null;

  thumbCurrent = null;

  duration = "168h";

  get durationData() {
    const getDurationData = this.$utils.helper.getDurationData;

    return getDurationData(this.data, this.duration, (x) => x?.ts, 100);
  }

  get thumbData() {
    const getDurationData = this.$utils.helper.getDurationData;

    return getDurationData(this.data, "168h", (x) => x?.ts, 10);
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
        hint: this.$t("profit.hint"),
      },
      {
        text: this.$t("profits") + ` (${this.meta.quoteAssetSymbol})`,
        value: 1,
        hint: this.$t("profit.hint"),
      },
    ];
  }

  get titles() {
    const getPairMeta = this.$utils.pair.getPairMeta;
    const format = this.$utils.number.format;
    const toFiat = this.$utils.currency.toFiat;
    const attachSign = this.$utils.number.attachSign;
    const h = this.$createElement;
    const getColor = this.$utils.color.getColor;

    const time = this.current?.[0] ?? 0;
    const data = this.current?.[1] ?? 0;
    const thumbData = this.thumbCurrent?.[1] ?? 0;

    const { baseAsset, quoteAsset } = getPairMeta(this, this.pair)!;
    const asset = this.type === 0 ? baseAsset : quoteAsset;

    const formatData = (data) => {
      const style = { color: getColor(this, data) };
      const text = attachSign({
        n: data,
        text: format({ n: Math.abs(data) }),
      });

      return h("span", { staticStyle: style }, [
        text,
        h("span", { staticClass: "symbol ml-1" }, [asset.symbol]),
      ]);
    };

    const title = formatData(data);
    const thumbTitle = formatData(thumbData);

    const hint = "≈ " + toFiat(this, { n: +data * +asset.price });
    const thumbHint = "≈ " + toFiat(this, { n: +thumbData * +asset.price });

    const subtitle =
      (time && this.$utils.time.format(time, "MMM DD, YYYY HH:mm")) || "";

    return {
      title,
      subtitle,
      hint,
      thumbTitle,
      thumbHint,
    };
  }
}
export default ProfitChartPanel;
</script>
