<template>
  <v-lazy :options="{ threshold: 0.5 }" transition="fade-transition">
    <div :class="classes">
      <swap-transasction v-if="meta.isSwap" :transaction="transaction" />
      <liquidity-transaction v-else :transaction="transaction" />
      <f-divider opacity="0.05" />
    </div>
  </v-lazy>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import SwapTransasction from "./SwapTransaction.vue";
import LiquidityTransaction from "./LiquidityTransaction.vue";

@Component({
  components: {
    SwapTransasction,
    LiquidityTransaction,
  },
})
class TransactionItem extends Vue {
  @Prop() transaction!: API.Transaction;

  get meta() {
    const isSwap = this.transaction.type === "Swap";

    return {
      isSwap,
    };
  }

  get classes() {
    return {
      "transaction-item": true,
      "transaction-item--swap": this.meta.isSwap,
      "transaction-item--liquidity": !this.meta.isSwap,
    };
  }
}
export default TransactionItem;
</script>

<style lang="scss" scoped>
.transation-item {
  border-bottom: 0.5px solid
    rgba($color: var(--v-greyscale_1-base), $alpha: 0.05);
}
</style>
