<template>
  <ve-candle
    ref="priceChart"
    :height="height"
    :grid="grid"
    :extend="extend"
    :series="series"
    :x-axis="xAxis"
    :y-axis="yAxis"
    :colors="colors"
    :tooltip="tooltip"
    :textStyle="textStyle"
    :after-set-option="handleAfterSetOption"
    class="price-chart"
  ></ve-candle>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class PriceChart extends Vue {
  isDark = this.$vuetify.theme.dark;

  @Prop() data!: API.KlineData[];

  @Prop() reverse!: boolean;

  get colors() {
    return [this.$vuetify.theme.currentTheme.primary];
  }

  get gridColor() {
    return this.isDark ? "#3b3c3d" : "#eeeeee";
  }

  get textColor() {
    return this.isDark ? "#9b9c9d" : "#666666";
  }

  get tooltipColor() {
    return this.isDark ? "rgba(255, 255, 255, .15)" : "rgba(0, 0, 0, .05)";
  }

  getColorUpDown(isUp?: boolean) {
    // truely -> up  falsly -> down
    return isUp
      ? this.$utils.color.colorUp(this)
      : this.$utils.color.colorDown(this);
  }

  height = "100%";

  grid = [{ top: 10, bottom: 10, left: 10, right: 10 }];

  textStyle = {
    fontFamily: `"-apple-system, BlinkMacSystemFont, SF Compact Display Medium, "PingFang SC", "Helvetica Neue", Roboto"`,
  };

  extend = {
    dataZoom: [
      {
        type: "inside",
      },
    ],
    legend: {
      show: false,
    },
  };

  xAxis = {
    show: true,
    scale: true,
    type: "time",
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      showMinLabel: false,
      formatter: (v) => {
        return this.$utils.time.format(v, "MMM DD");
      },
      color: this.textColor,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: this.gridColor,
      },
    },
    axisPointer: {
      lineStyle: {
        type: "dotted",
      },
    },
  };

  yAxis = {
    show: true,
    scale: true,
    position: "right",
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: true,
      showMinLabel: false,
      showMaxLabel: false,
      formatter: (v) => {
        return this.$utils.number.format({ n: v });
      },
      color: this.textColor,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: this.gridColor,
      },
    },
  };

  get currentY() {
    const point = this.data[this.data.length - 1];
    return this.reverse ? point[2] : point[1];
  }

  get series() {
    return [
      {
        type: "candlestick",
        barMaxWidth: "4",
        data: this.data.map((d, index) => {
          const prevIndex = index - 1 < 0 ? 0 : index - 1;
          const prev = this.data[prevIndex];
          if (this.reverse) {
            return [d[0] * 1000, +prev[2], +d[2], +prev[2], +d[2]];
          } else {
            return [d[0] * 1000, +prev[1], +d[1], +prev[1], +d[1]];
          }
        }),
        markLine: {
          silent: true,
          animation: false,
          label: {
            position: "insideEndTop",
            formatter: ({ data }) => {
              return this.$utils.number.format({ n: data.value });
            },
          },
          symbol: ["none", "none"],
          data: [
            {
              yAxis: this.currentY,
            },
          ],
          lineStyle: {
            color: "#666",
          },
        },
        itemStyle: {
          normal: {
            color: this.getColorUpDown(true),
            color0: this.getColorUpDown(false),
            borderColor: this.getColorUpDown(true),
            borderColor0: this.getColorUpDown(false),
          },
        },
      },
    ];
  }

  get tooltip() {
    return {
      trigger: "axis",
      axisPointer: {
        type: "line",
      },
      alwaysShowContent: true,
      backgroundColor: this.tooltipColor,
      borderColor: "transparent",
      transitionDuration: 0,
      textStyle: {
        color: this.textColor,
      },
      formatter: ([params]) => {
        const time = this.$utils.time.format(
          params.axisValue,
          "MM/DD HH:mm A Z"
        );
        const low = this.reverse
          ? this.$utils.number.format({ n: params.data[2] })
          : this.$utils.number.format({ n: params.data[1] });
        return [
          `<div class="price-chart__tooltip">`,
          `<div class="price-chart__tooltip-value">${low}</div>`,
          `<div class="price-chart__tooltip-time">${time}</div>`,
          `</div>`,
        ].join("");
      },
      position: function () {
        return { top: 10, left: 10 };
      },
      extraCssText: "width: 170px",
    };
  }

  handleAfterSetOption(chart) {
    const showDefaultTip = () =>
      chart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: this.data.length - 1,
      });

    showDefaultTip();
    chart.on("globalout", () => {
      showDefaultTip();
    });
  }
}
export default PriceChart;
</script>

<style lang="scss" scoped>
.price-chart {
  z-index: 0;

  ::v-deep {
    .price-chart__tooltip {
      .price-chart__tooltip-value {
        color: var(--v-primary-base);
        font-size: 18px;
        margin-bottom: 4px;
      }

      .price-chart__tooltip-time {
        font-size: 12px;
      }
    }
  }
}
</style>
