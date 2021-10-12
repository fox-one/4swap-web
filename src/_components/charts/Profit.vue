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
    class="profit-chart"
  ></ve-line>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
class ProfitChart extends Vue {
  isDark = this.$vuetify.theme.dark;

  @Prop() data!: API.PairProfits[];

  textStyle = {
    fontFamily: `"-apple-system, BlinkMacSystemFont, SF Compact Display Medium, "PingFang SC", "Helvetica Neue", Roboto"`,
  };

  get colors() {
    return [this.$vuetify.theme.currentTheme.primary];
  }

  get textColor() {
    return this.isDark ? "#9b9c9d" : "#666666";
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
        name: "Profit Rate",
        smooth: false,
        data: this.data.map((x) => x.quoteProfitRateValue.toFixed(4)),
        showSymbol: false,
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
        formatter: (value) => {
          return this.$utils.number.toPercent(value, true);
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
      formatter: ([data]) => {
        const time = this.$utils.time.format(
          data.axisValue * 1000,
          "MM/DD YYYY"
        );
        const baseValue = this.$utils.number.toPercent(data.value, true);
        return [
          `<div class="profit-chart__tooltip">`,
          `<div class="profit-chart__tooltip-value">${baseValue}</div>`,
          `<div class="profit-chart__tooltip-time">${time}</div>`,
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
export default ProfitChart;
</script>

<style lang="scss" scoped>
.profit-chart {
  z-index: 0;

  ::v-deep {
    .profit-chart__tooltip {
      .profit-chart__tooltip-value {
        color: var(--v-primary-base);
        font-size: 18px;
        margin-bottom: 4px;
      }

      .profit-chart__tooltip-time {
        font-size: 12px;
      }
    }
  }
}
</style>
