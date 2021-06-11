<template>
  <div v-if="profits">
    <div class="f-caption f-greyscale-3 mt-1">
      {{ $t("liquidity.profits.fiat") }} ({{ meta.unit }})
    </div>
    <v-layout class="body-2">
      <v-flex>
        {{ meta.percent }}
      </v-flex>
      <v-flex class="text-right">
        <span>≈ {{ meta.symbol }}{{ meta.amount }} </span>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class PairFiatProfit extends Vue {
  @Prop() profits!: API.PairProfits;

  get meta() {
    return {
      percent: this.profits.fiatProfitRate,
      amount: this.profits.fiatProfit,
      symbol: "$",
      unit: "USD",
    };
  }
}
export default PairFiatProfit;
</script>
