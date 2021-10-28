<template>
  <base-line-chart
    :data="chartData"
    :point.sync="point"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, PropSync } from "vue-property-decorator";
import BaseLineChart from "../BaseLineChart.vue";

@Component({
  components: {
    BaseLineChart,
  },
})
class ProfitChart extends Vue {
  @PropSync("current") bindCurrent;

  @Prop() pair;

  @Prop() type;

  @Prop() data!: API.PairProfits[];

  point = null;

  get chartData() {
    const toFiat = this.$utils.currency.toFiat;
    const getPairMeta = this.$utils.pair.getPairMeta;
    const { isReverse } = getPairMeta(this, this.pair)!;

    let fn = (x) => {
      let [baseProfit, quoteProfit] = [x.baseProfit, x.quoteProfit];

      if (isReverse) {
        [baseProfit, quoteProfit] = [quoteProfit, baseProfit];
      }

      return this.type === 0
        ? baseProfit
        : this.type === 1
        ? quoteProfit
        : toFiat(this, { n: x.fiatProfit, intl: false });
    };

    return this.data.map((x) => [x.ts * 1000, fn(x)]);
  }

  @Watch("chartData", { immediate: true })
  @Watch("point", { immediate: true })
  handlePointChange() {
    const current = this.point || this.chartData[this.chartData.length - 1];

    this.bindCurrent = current;
  }
}
export default ProfitChart;
</script>
