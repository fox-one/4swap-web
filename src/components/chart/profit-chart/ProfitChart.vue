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

export function getChartData(vm: Vue, data, pair, type) {
  const toFiat = vm.$utils.currency.toFiat;

  let fn = (x) => {
    let [baseProfit, quoteProfit] = [x.baseProfit, x.quoteProfit];

    return type === 0
      ? baseProfit
      : type === 1
      ? quoteProfit
      : toFiat(vm, { n: x.fiatProfit, intl: false });
  };

  return data.map((x) => [x.ts * 1000, fn(x)]);
}

@Component({
  components: {
    BaseLineChart,
  },
})
class ProfitChart extends Vue {
  @PropSync("current") bindCurrent;

  @Prop() pair;

  @Prop() type;

  @Prop() duration;

  @Prop() data!: API.PairProfits[];

  point = null;

  get chartData() {
    return getChartData(this, this.data, this.pair, this.type);
  }

  @Watch("duration", { immediate: true })
  @Watch("type", { immediate: true })
  @Watch("point", { immediate: true })
  handlePointChange() {
    const current = this.point || this.chartData[this.chartData.length - 1];

    this.bindCurrent = current;
  }
}
export default ProfitChart;
</script>
