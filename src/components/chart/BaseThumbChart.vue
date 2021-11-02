<template>
  <base-chart ref="chart" :option="option" :loading="loading" />
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop, Watch } from "vue-property-decorator";
import BaseChart from "./BaseChart.vue";
import { getBaseOption } from "./BaseChart.vue";

import type { EChartsOption } from "echarts";

@Component({
  components: {
    BaseChart,
  },
})
class BaseChartThumb extends Vue {
  @Prop() colors;

  @Prop() data;

  @Prop() loading;

  @Ref("chart") chart;

  get option(): EChartsOption {
    return {
      ...getBaseOption(this, this.data, this.colors),
      grid: [{ top: 0, bottom: 0, left: 0, right: 0 }],
      xAxis: {
        show: false,
        type: "time",
      },
      series: [
        {
          type: "line",
          smooth: true,
          symbolSize: 0.1,
          symbol: "circle",
          animation: false,
          lineStyle: {
            width: 2,
          },
        },
      ],
    };
  }

  @Watch("data")
  handleDataChange() {
    this.chart?.setOption({ dataset: { source: this.data } });
  }
}
export default BaseChartThumb;
</script>
