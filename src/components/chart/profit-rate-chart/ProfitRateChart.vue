<template>
  <base-line-chart
    :data="chartData"
    :point.sync="point"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script lang="ts">
import { Component, Vue, PropSync, Prop, Watch } from "vue-property-decorator";
import BaseLineChart from "../BaseLineChart.vue";

export function getChartData(vm: Vue, data, pair, type) {
  const getPairMeta = vm.$utils.pair.getPairMeta;
  const { isReverse } = getPairMeta(vm, pair)!;

  let fn = (x: API.PairProfits) => {
    let [baseProfit, quoteProfit] = [x.baseProfitRate, x.baseProfitRate];

    if (isReverse) {
      [baseProfit, quoteProfit] = [quoteProfit, baseProfit];
    }

    return type === 0
      ? baseProfit
      : type === 1
      ? quoteProfit
      : x.fiatProfitRate;
  };

  return data.map((x) => [x.ts * 1000, fn(x)]);
}

@Component({
  components: {
    BaseLineChart,
  },
})
class ProfitRateChart extends Vue {
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
export default ProfitRateChart;
</script>
