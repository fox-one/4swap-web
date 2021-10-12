<template>
  <div v-if="profits">
    <div class="caption f-greyscale-3 mt-1">
      {{ $t("liquidity.profits.coin") }} ({{ meta.symbol }})
    </div>
    <v-layout class="body-2">
      <v-flex>
        {{ meta.percent }}
      </v-flex>
      <v-flex class="text-right">
        <v-icon size="16" @click="handleSwitch">
          {{ $icons.mdiSync }}
        </v-icon>
        <span :style="{ color: meta.color }">
          {{ meta.amount }} {{ meta.symbol }}
        </span>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
class PairProfit extends Vue {
  @Prop() profits!: API.PairProfits;

  @Prop() baseAsset!: API.Asset;

  @Prop() quoteAsset!: API.Asset;

  direction = 0;

  colors = ["#eb4880", "#63cb49"];

  get meta() {
    if (this.direction === 0) {
      return {
        symbol: this.baseAsset.symbol,
        percent: this.profits.baseProfitRate,
        amount:
          +this.profits.baseProfit > 0
            ? "+" + this.profits.baseProfit
            : this.profits.baseProfit,
        color:
          this.profits.baseProfitRateValue > 0
            ? this.colors[0]
            : this.colors[1],
      };
    }
    return {
      symbol: this.quoteAsset.symbol,
      percent: this.profits.quoteProfitRate,
      amount:
        +this.profits.quoteProfit > 0
          ? "+" + this.profits.quoteProfit
          : this.profits.quoteProfit,
      color:
        this.profits.quoteProfitRateValue > 0 ? this.colors[0] : this.colors[1],
    };
  }

  handleSwitch() {
    this.direction = (this.direction + 1) % 2;
  }
}
export default PairProfit;
</script>
