<template>
  <base-line-chart
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
class LiquidityChart extends Vue {
  @Prop() data!: API.MarketData[];

  @PropSync("current") bindCurrent;

  point = null;

  @Watch("data", { immediate: true })
  @Watch("point", { immediate: true })
  handlePointChange() {
    const current = this.point || this.chartData[this.chartData.length - 1];

    this.bindCurrent = current;
  }

  get chartData() {
    return this.data.map((x) => [x.ts * 1000, x.value]);
  }
}
export default LiquidityChart;
</script>
