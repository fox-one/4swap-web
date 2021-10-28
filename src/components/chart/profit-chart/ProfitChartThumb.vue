<template>
  <base-thumb-chart :data="chartData" v-bind="$attrs" v-on="$listeners" />
</template>

<script lang="ts">
import { Component, Vue, PropSync, Prop, Watch } from "vue-property-decorator";
import BaseThumbChart from "../BaseThumbChart.vue";

@Component({
  components: {
    BaseThumbChart,
  },
})
class ProfitChartThumb extends Vue {
  @PropSync("current") bindCurrent;

  @Prop() pair;

  @Prop() type;

  @Prop() data!: API.PairProfits[];

  get chartData() {
    const toFiat = this.$utils.currency.toFiat;
    const getPairMeta = this.$utils.pair.getPairMeta;
    const { isReverse } = getPairMeta(this, this.pair)!;

    let fn = (x) => {
      let [baseProfit, quoteProfit] = [x.baseProfit, x.quoteProfit];

      if (isReverse) {
        [baseProfit, quoteProfit] = [quoteProfit, baseProfit];
      }

      return this.type === 0
        ? baseProfit
        : this.type === 1
        ? quoteProfit
        : toFiat(this, { n: x.fiatProfit, intl: false });
    };

    return this.data.map((x) => [x.ts * 1000, fn(x)]);
  }

  @Watch("chartData", { immediate: true })
  handlePointChange() {
    const current = this.chartData[this.chartData.length - 1];

    this.bindCurrent = current;
  }
}
export default ProfitChartThumb;
</script>
