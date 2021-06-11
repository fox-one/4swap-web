<template>
  <v-layout class="body-2">
    <span> {{ baseText }} </span>
    <span class="mx-1">/</span>
    <span class="text-right"> {{ quoteText }} </span>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class PairLiquidity extends Vue {
  @Prop() baseAsset!: API.Asset;

  @Prop() baseAmount!: string;

  @Prop() quoteAsset!: API.Asset;

  @Prop() quoteAmount!: string;

  get baseText() {
    const amount = this.$utils.number.format({ n: this.baseAmount, p: 8 });
    return amount + " " + this.baseAsset.symbol;
  }

  get quoteText() {
    const amount = this.$utils.number.format({ n: this.quoteAmount, p: 8 });
    return amount + " " + this.quoteAsset.symbol;
  }
}
export default PairLiquidity;
</script>
