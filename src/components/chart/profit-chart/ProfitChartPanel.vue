<template>
  <profit-chart-panel-layout
    :types="types"
    :type.sync="type"
    :duration.sync="duration"
    :title="titles.title"
    :subtitle="titles.subtitle"
    :thumb-title="titles.thumbTitle"
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

    return getDurationData(this.data, "168h", (x) => x?.ts);
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

  get titles() {
    const getPairMeta = this.$utils.pair.getPairMeta;
    const format = this.$utils.number.format;
    const toFiat = this.$utils.currency.toFiat;
    const h = this.$createElement;
    const getColor = this.$utils.color.getColor;

    const time = this.current?.[0] ?? 0;
    const data = this.current?.[1] ?? 0;
    const thumbData = this.thumbCurrent?.[1] ?? 0;

    const { baseAsset, quoteAsset } = getPairMeta(this, this.pair)!;
    const baseAssetSymbol = baseAsset.symbol;
    const quoteAssetSymbol = quoteAsset.symbol;
    const sign = +data >= 0 ? "+" : "-";

    const formatData = (data, type) => {
      const style = { color: getColor(this, data) };

      if (this.type === 2) {
        return h("span", { staticStyle: style }, [
          `${sign} ${toFiat(this, { n: Math.abs(data) })}`,
        ]);
      } else {
        const symbol = type === 0 ? baseAssetSymbol : quoteAssetSymbol;

        return h("span", { staticStyle: style }, [
          `${sign} ${format({ n: Math.abs(data) })}`,
          h("span", { staticClass: "symbol ml-1" }, [symbol]),
        ]);
      }
    };

    const title = (data && formatData(data, this.type)) || "";
    const thumbTitle = (thumbData && formatData(thumbData, this.type)) || "";
    const subtitle =
      (time && this.$utils.time.format(time, "MMM DD HH:mm A Z")) || "";

    return {
      title,
      subtitle,
      thumbTitle,
    };
  }
}
export default ProfitChartPanel;
</script>
