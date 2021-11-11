<template>
  <base-line-chart
    v-if="pair"
    :data="chartData"
    :point.sync="point"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Watch } from "vue-property-decorator";
import BaseLineChart from "../BaseLineChart.vue";

@Component({
  components: {
    BaseLineChart,
  },
})
class PriceChart extends Vue {
  @Prop() data!: API.KlineData[];

  @Prop() pair;

  @Prop() chartType;

  @PropSync("current") bindCurrent;

  point = null;

  get reverse() {
    const { isReverse } = this.$utils.pair.getPairMeta(this, this.pair) || {};
    const chartReverse = this.chartType === "1";

    return isReverse !== chartReverse;
  }

  @Watch("reverse")
  @Watch("data", { immediate: true })
  @Watch("point", { immediate: true })
  handlePointChange() {
    const current = this.point || this.chartData[this.chartData.length - 1];

    this.bindCurrent = current;
  }

  get chartData() {
    return this.data.map((x) => [x[0] * 1000, this.reverse ? x[2] : x[1]]);
  }
}
export default PriceChart;
</script>
