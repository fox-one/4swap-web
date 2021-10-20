<template>
  <div class="py-4">
    <v-layout align-center class="mb-3">
      <v-flex class="value">{{ meta.totalValue }}</v-flex>
      <span class="time">{{ meta.time }}</span>
    </v-layout>

    <div class="greyscale_3--text items">
      <asset-amount :asset="meta.input" :amount="meta.inputAmount" />
      <span class="mx-2 arrow">-></span>
      <asset-amount :asset="meta.output" :amount="meta.outputAmount" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";
import AssetAmount from "./AssetAmount.vue";

@Component({
  components: {
    AssetAmount,
  },
})
class SwapTransaction extends Vue {
  @Prop() transaction!: API.Transaction;

  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const toRelative = this.$utils.time.toRelative;
    const getAssetById = this.$store.getters[GlobalGetters.GET_ASSET_BY_ID];

    const {
      base_asset_id,
      quote_asset_id,
      pay_asset_id,
      base_amount,
      quote_amount,
    } = this.transaction;

    const baseAsset = getAssetById(base_asset_id);
    const quoteAsset = getAssetById(quote_asset_id);
    const isPayBaseAsset = pay_asset_id === base_asset_id;
    const [input, output, inputAmount, outputAmount] = isPayBaseAsset
      ? [baseAsset, quoteAsset, base_amount, quote_amount]
      : [quoteAsset, baseAsset, quote_amount, base_amount];

    return {
      input,
      output,
      inputAmount: Math.abs(+inputAmount),
      outputAmount: Math.abs(+outputAmount),
      totalValue: toFiat(this, { n: this.transaction.value }),
      time: toRelative(this.transaction.created_at),
    };
  }
}
export default SwapTransaction;
</script>

<style lang="scss" scoped>
.value {
  font-size: 14px;
  font-weight: 600;
  font-feature-settings: "salt" on;
}

.time {
  font-size: 12px;
  color: var(--v-greyscale_4-base);
}

.items {
  display: grid;
  position: relative;
  grid-template-columns: 1fr 1fr;

  .arrow {
    position: absolute;
    left: calc(50% - 40px);
    top: -2px;
  }
}
</style>
