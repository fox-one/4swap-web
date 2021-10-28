<template>
  <base-bar-chart
    :data="chartData"
    :point.sync="point"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from "vue-property-decorator";
import BaseBarChart from "../BaseBarChart.vue";

@Component({
  components: {
    BaseBarChart,
  },
})
class VolumeChart extends Vue {
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
    return this.data.map((x) => [x.ts * 1000, x.volume]);
  }
}
export default VolumeChart;
</script>
