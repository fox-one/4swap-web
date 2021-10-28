<template>
  <base-chart
    ref="chart"
    :option="option"
    :loading="loading"
    @after-init="handleAfterInit"
  />
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Ref,
  Prop,
  Watch,
  PropSync,
} from "vue-property-decorator";
import BaseChart from "./BaseChart.vue";
import { getBaseOption } from "./BaseChart.vue";

import type { EChartsOption } from "echarts";

@Component({ components: { BaseChart } })
class BaseLineChart extends Vue {
  @PropSync("point") bindPoint;

  @Prop() colors;

  @Prop() data;

  @Prop() loading;

  @Ref("chart") chart;

  get option(): EChartsOption {
    return {
      ...getBaseOption(this, this.data, this.colors),
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
          emphasis: {
            lineStyle: {
              width: 2,
            },
            itemStyle: {
              borderWidth: 10,
              borderColor: this.colors[0],
            },
          },
        },
      ],
    };
  }

  @Watch("data")
  handleDataChange() {
    this.chart?.setOption({ dataset: { source: this.data } });
    this.bindPoint = null;
  }

  handleAfterInit(chart) {
    chart.on("highlight", (params) => {
      const point = this.data[params.batch?.[0]?.dataIndex];

      point && this.handleSetVisualMap(chart, point);
    });

    chart.on("downplay", () => {
      const point = this.data[this.data.length - 1];

      this.handleSetVisualMap(chart, point);
    });
  }

  handleSetVisualMap(chart, point) {
    this.bindPoint = point;

    chart?.setOption({
      visualMap: {
        type: "piecewise",
        dimension: 0,
        show: false,
        pieces: [
          { gt: point[0], colorAlpha: 0.1 },
          { gt: 0, lte: point[0], colorAlpha: 1 },
        ],
      },
    });
  }
}
export default BaseLineChart;
</script>