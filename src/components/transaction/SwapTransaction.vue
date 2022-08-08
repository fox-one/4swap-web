<template>
  <div
    class="pa-4 mx-n4"
    :class="{ 'transaction--expand': expand }"
    @click="handleToggle"
  >
    <v-layout>
      <v-icon size="16" color="greyscale_3">
        $FIconConvertDirection4PBold
      </v-icon>

      <v-flex class="ml-4">
        <v-layout class="transaction-title">
          <v-flex>{{ meta.text }}</v-flex>
          <div>{{ meta.totalValue }}</div>
        </v-layout>

        <div v-if="expand">
          <asset-amount
            :input="true"
            :asset="meta.input"
            :amount="meta.inputAmount"
          />
          <asset-amount :asset="meta.output" :amount="meta.outputAmount" />
        </div>

        <v-layout class="transaction-label mt-3">
          <v-flex>{{ meta.time }}</v-flex>
          <div
            class="expand-action"
            :class="{ 'expand-action--active': !expand }"
          >
            <span v-if="expand">{{ $t("less") }}</span>
            <span v-else>{{ $t("more") }}</span>
            <v-icon size="12" color="greyscale_3" class="expand-icon">
              $IconPolygon
            </v-icon>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
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

  expand = false;

  ticker = {
    input: null,
    output: null,
  };

  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const format = this.$utils.time.format;
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
      text: `${input.symbol} -> ${output.symbol}`,
      inputAmount: Math.abs(+inputAmount),
      outputAmount: Math.abs(+outputAmount),
      totalValue: toFiat(this, { n: this.transaction.value }),
      time: format(this.transaction.created_at),
    };
  }

  handleToggle() {
    this.expand = !this.expand;
  }
}
export default SwapTransaction;
</script>

<style lang="scss" scoped>
.transaction-title {
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
}

.transaction-label {
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: var(--v-greyscale_3-base);
}

.transaction--expand {
  background: var(--v-greyscale_6-base);
}

.expand-action {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.expand-action--active {
  .expand-icon {
    transform: rotate(180deg);
    transition: 0.2s ease;
  }
}
</style>
