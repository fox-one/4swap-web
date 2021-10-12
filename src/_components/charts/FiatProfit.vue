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
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class FiatProfit extends Vue {
  isDark = this.$vuetify.theme.dark;

  @Prop() data!: API.PairProfits[];

  textStyle = {
    fontFamily: `"-apple-system, BlinkMacSystemFont, SF Compact Display Medium, "PingFang SC", "Helvetica Neue", Roboto"`,
  };

  get colors() {
    return ["#6f767c", this.$vuetify.theme.currentTheme.primary];
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
        name: "不做市法币收益率",
        smooth: true,
        data: this.data.map((x) => x.originFiatProfitRateValue?.toFixed(4)),
        showSymbol: false,
        lineStyle: {
          color: "#6f767c",
        },
      },
      {
        type: "line",
        name: "做市法币收益率",
        smooth: true,
        data: this.data.map((x) => x.fiatProfitRateValue?.toFixed(4)),
        showSymbol: false,
        lineStyle: {
          color: this.colors[1],
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
        color: "rgba(0,0,0,.2)",
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
        color: "rgba(0,0,0,.2)",
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
      formatter: ([originFiatRate, fiatRate]) => {
        const time = this.$utils.time.format(
          fiatRate.axisValue * 1000,
          "MM/DD YYYY"
        );
        const fiatRateText = this.$utils.number.toPercent(fiatRate.value, true);
        const originFiatRateText = this.$utils.number.toPercent(
          originFiatRate.value,
          true
        );
        return [
          `<div class="profit-chart__tooltip">`,
          `<div>`,
          `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#EB70AB;"></span>`,
          `<span class="profit-chart__tooltip-label">${this.$t(
            "chart.label.as-marketer"
          )}: </span>`,
          `<span class="profit-chart__tooltip-value">${fiatRateText}</span>`,
          `</div>`,
          `<div>`,
          `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#6f767c;"></span>`,
          `<span class="profit-chart__tooltip-label">${this.$t(
            "chart.label.not-as-marketer"
          )}: </span>`,
          `<span class="profit-chart__tooltip-value">${originFiatRateText}</span>`,
          `</div>`,
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
export default FiatProfit;
</script>

<style lang="scss" scoped>
.profit-chart {
  z-index: 0;

  ::v-deep {
    .profit-chart__tooltip {
      font-size: 13px;

      .profit-chart__tooltip-value {
        color: var(--v-primary-base);
        font-size: 14px;
        margin-bottom: 4px;
        font-weight: 900;
      }

      .profit-chart__tooltip-time {
        font-size: 12px;
      }
    }
  }
}
</style>
