<template>
  <ve-line
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
    class="liquidity-chart"
  ></ve-line>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class LiquidityChart extends Vue {
  isDark = this.$vuetify.theme.dark;

  @Prop() data!: API.MarketData[];

  textStyle = {
    fontFamily: `"-apple-system, BlinkMacSystemFont, SF Compact Display Medium, "PingFang SC", "Helvetica Neue", Roboto"`,
  };

  get colors() {
    return [this.$vuetify.theme.currentTheme.primary];
  }

  get textColor() {
    return this.isDark ? "#9b9c9d" : "#666666";
  }

  get areaColor() {
    return this.isDark
      ? ["rgba(241, 106, 171, .24)", "rgba(241, 106, 171, 0)"]
      : ["rgba(238, 69, 150, .24)", "rgba(238, 69, 150, 0)"];
  }

  get tooltipColor() {
    return this.isDark ? "rgba(255, 255, 255, .15)" : "rgba(0, 0, 0, .05)";
  }

  height = "100%";

  grid = [{ top: 10, bottom: 10, left: 0, right: 10 }];

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

  get series() {
    return [
      {
        type: "line",
        name: "Liquidity",
        smooth: true,
        data: this.data.map((x) => x.value),
        showSymbol: false,
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: this.areaColor[0],
              },
              {
                offset: 1,
                color: this.areaColor[1],
              },
            ],
            global: false,
          },
        },
      },
    ];
  }

  get xAxis() {
    return {
      show: true,
      type: "category",
      data: this.data.map((x) => x.ts),
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        showMinLabel: false,
        formatter: (v) => {
          return this.$utils.time.format(v * 1000, "MMM DD");
        },
        color: this.textColor,
      },
      axisPointer: {
        lineStyle: {
          type: "dotted",
        },
      },
    };
  }

  get yAxis() {
    return {
      show: true,
      // scale: true,
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
        formatter: (value) => {
          return this.$utils.number.simplizeFiat(this, value);
        },
        color: this.textColor,
      },
      splitLine: {
        show: false,
      },
    };
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
          params.axisValue * 1000,
          "MM/DD YYYY"
        );
        const value = this.$utils.number.formatFiat(this, params.value);
        return [
          `<div class="liquidity-chart__tooltip">`,
          `<div class="liquidity-chart__tooltip-value">${value}</div>`,
          `<div class="liquidity-chart__tooltip-time">${time}</div>`,
          `</div>`,
        ].join("");
      },
      position: function () {
        return { top: 10, left: 10 };
      },
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
export default LiquidityChart;
</script>

<style lang="scss" scoped>
.liquidity-chart {
  z-index: 0;

  ::v-deep {
    .liquidity-chart__tooltip {
      .liquidity-chart__tooltip-value {
        color: var(--v-primary-base);
        font-size: 18px;
        margin-bottom: 4px;
      }

      .liquidity-chart__tooltip-time {
        font-size: 12px;
      }
    }
  }
}
</style>
