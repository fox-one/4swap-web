<template>
  <div v-intersect="{ handler: handleIntersect }" class="transaction-item my-2">
    <v-layout v-if="isIntersecting" align-center>
      <v-flex>
        <div class="body-2">
          <template v-if="meta.isSwap">
            <swap-text :input="meta.input" :output="meta.output" />
          </template>
          <template v-else>
            {{ meta.text }}
          </template>
        </div>
        <div class="caption f-greyscale-3">
          {{ meta.time }}
        </div>
      </v-flex>
      <div>
        {{ meta.totalValue }}
      </div>
    </v-layout>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Vue, Prop } from "vue-property-decorator";
import { IPair, ITransaction, TxType } from "~/services/types/vo";
import { VIcon } from "vuetify/lib";
import { Getter } from "vuex-class";

const SwapText = Vue.extend({
  props: ["input", "output"],
  render(h) {
    return h("div", { staticClass: "d-flex align-center" }, [
      this.input,
      h(VIcon, { props: { size: 16 } }, [this.$icons.mdiArrowRight]),
      this.output,
    ]);
  },
});

@Component({
  components: {
    SwapText,
  },
})
class TransactionItem extends Vue {
  @Prop() transaction!: ITransaction;

  @Getter("global/getAssetById") getAssetById;

  isIntersecting = false;

  get meta() {
    const transaction = this.transaction;
    const fiatSymbol = "$";
    const time = this.$utils.time.toRelative(transaction.created_at);
    const totalValue = `${fiatSymbol}${transaction.value}`;
    const isSwap = transaction.type === TxType.Swap;

    let text, symbols;
    switch (transaction.type) {
      case TxType.Swap:
        symbols = this.getSwapSymbols();
        break;
      case TxType.Add:
        text = this.$t("liquidity.add");
        break;
      case TxType.Remove:
        text = this.$t("liquidity.remove");
        break;
    }

    return {
      text,
      time,
      totalValue,
      isSwap,
      input: symbols?.input,
      output: symbols?.output,
    };
  }

  getSwapSymbols() {
    const inputAssetId = this.transaction.pay_asset_id;
    const outputAssetId =
      this.transaction.base_asset_id === inputAssetId
        ? this.transaction.quote_asset_id
        : this.transaction.base_asset_id;
    const inputAsset = this.getAssetById(inputAssetId);
    const outputAsset = this.getAssetById(outputAssetId);
    const inputSymbol = inputAsset?.symbol;
    const outputSymbol = outputAsset?.symbol;
    const isSameSymbol = inputAsset && inputSymbol === outputSymbol;
    return isSameSymbol
      ? {
          input: inputAsset?.display_symbol ?? "",
          output: outputAsset?.display_symbol ?? "",
        }
      : {
          input: inputSymbol,
          output: outputSymbol,
        };
  }

  handleIntersect(_enteries, _observer, isIntersecting) {
    this.isIntersecting = isIntersecting;
  }
}
export default TransactionItem;
</script>

<style lang="scss" scoped>
.transaction-item {
  min-height: 40px;
}
</style>
