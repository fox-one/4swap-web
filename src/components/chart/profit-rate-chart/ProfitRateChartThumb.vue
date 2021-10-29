<template>
  <base-thumb-chart :data="chartData" v-bind="$attrs" v-on="$listeners" />
</template>

<script lang="ts">
import { Component, Vue, PropSync, Prop, Watch } from "vue-property-decorator";
import BaseThumbChart from "../BaseThumbChart.vue";
import { getChartData } from "./ProfitRateChart.vue";

@Component({
  components: {
    BaseThumbChart,
  },
})
class ProfitRateChartThumb extends Vue {
  @PropSync("current") bindCurrent;

  @Prop() pair;

  @Prop() type;

  @Prop() data!: API.PairProfits[];

  get chartData() {
    return getChartData(this, this.data, this.pair, this.type);
  }

  @Watch("chartData", { immediate: true })
  handlePointChange() {
    const current = this.chartData[this.chartData.length - 1];

    this.bindCurrent = current;
  }
}
export default ProfitRateChartThumb;
</script>
