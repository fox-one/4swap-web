<template>
  <intersect-wrapper class="transaction-item py-4">
    <div v-if="meta.text" class="f-greyscale-3 f-caption mb-2">
      {{ meta.text }}
    </div>
    <div class="f-body-2 transaction-item-wrapper">
      <v-layout class="mb-4">
        <v-flex>
          <v-img
            style="display: inline-block; vertical-align: middle"
            width="20"
            height="20"
            :src="swapSymbols.inputIcon"
          />
          <span class="mx-1">
            {{ swapSymbols.inputSymbol }}
          </span>
          <span class="f-greyscale-3">
            {{ meta.baseAmountText }}
          </span>
        </v-flex>
        <v-flex style="text-align: right" class="f-greyscale-3">
          {{ meta.time }}
        </v-flex>
      </v-layout>
      <i
        v-if="showIcon"
        class="icon-triangle"
        :class="isDark && 'icon-triangle-dark'"
      />
      <v-layout class="d-flex align-center">
        <v-flex>
          <v-img
            style="display: inline-block; vertical-align: middle"
            width="20"
            height="20"
            :src="swapSymbols.outputIcon"
          />
          <span class="mx-1">
            {{ swapSymbols.outputSymbol }}
          </span>
          <span class="f-greyscale-3">
            {{ meta.quoteAmountText }}
          </span>
        </v-flex>
        <v-flex class="f-body-1 total-value">
          {{ meta.totalValue }}
        </v-flex>
      </v-layout>
    </div>
  </intersect-wrapper>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { VIcon } from "vuetify/lib";
import { Getter } from "vuex-class";
import IntersectWrapper from "../../base/IntersectWrapper.vue";

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
    IntersectWrapper,
  },
})
class LiqHistoryItem extends Vue {
  @Prop() transaction!: API.Transaction;

  @Prop({ default: "relative", type: String }) timeFormat!:
    | "relative"
    | "absolute";

  @Getter("global/getAssetById") getAssetById;

  isDark = this.$vuetify.theme.dark;

  showIcon = true;

  get swapSymbols() {
    const baseAssetId = this.transaction.base_asset_id;
    const quoteAssetId = this.transaction.quote_asset_id;
    const baseAsset = this.getAssetById(baseAssetId);
    const quoteAsset = this.getAssetById(quoteAssetId);
    const baseSymbol = baseAsset?.display_symbol || baseAsset?.symbol;
    const quoteSymbol = quoteAsset?.display_symbol || quoteAsset?.symbol;
    const isPayBaseAsset = this.transaction.pay_asset_id === baseAssetId;
    let inputAsset = baseAsset;
    let outputAsset = quoteAsset;
    let inputSymbol = baseSymbol;
    let outputSymbol = quoteSymbol;
    if (!isPayBaseAsset) {
      [inputAsset, outputAsset] = [outputAsset, inputAsset];
      [inputSymbol, outputSymbol] = [outputSymbol, inputSymbol];
    }

    return {
      baseAsset,
      quoteAsset,
      baseSymbol,
      quoteSymbol,
      inputSymbol,
      outputSymbol,
      isPayBaseAsset,
      baseIcon: baseAsset.logo,
      quoteIcon: quoteAsset.logo,
      inputIcon: inputAsset.logo,
      outputIcon: outputAsset.logo,
    };
  }

  get meta() {
    const format = this.$utils.number.format;
    let text, baseAmountSymbol, quoteAmountSymbol;
    switch (this.transaction.type) {
      case "Add":
        text = this.$t("liquidity.add");
        baseAmountSymbol = "+";
        quoteAmountSymbol = "+";
        this.showIcon = false;
        break;
      case "Remove":
        text = this.$t("liquidity.remove");
        baseAmountSymbol = "";
        quoteAmountSymbol = "";
        this.showIcon = false;
        break;
      case "Swap":
        baseAmountSymbol = this.swapSymbols.isPayBaseAsset ? "+" : "";
        quoteAmountSymbol = this.swapSymbols.isPayBaseAsset ? "" : "+";
        break;
    }
    const totalValue = this.formatFiat(this.transaction.value);
    const isSwap = this.transaction.type === "Swap";
    const timeFormatter =
      this.timeFormat === "absolute"
        ? this.$utils.time.relativeFormat
        : this.$utils.time.toRelative;
    const time = timeFormatter(this.transaction.created_at);
    const baseAmount = format({
      n: this.transaction.base_amount,
      p: 8,
    });
    const quoteAmount = format({
      n: this.transaction.quote_amount,
      p: 8,
    });
    let baseAmountText = `${baseAmountSymbol}${baseAmount}`;
    let quoteAmountText = `${quoteAmountSymbol}${quoteAmount}`;
    if (this.transaction.pay_asset_id !== this.transaction.base_asset_id) {
      [baseAmountText, quoteAmountText] = [quoteAmountText, baseAmountText];
    }

    return {
      time,
      text,
      isSwap,
      totalValue,
      baseAmountText,
      quoteAmountText,
    };
  }

  formatFiat(amountUsd, fraction = -1) {
    return this.$utils.number.formatFiat.call(this, this, amountUsd, fraction);
  }
}
export default LiqHistoryItem;
</script>

<style lang="scss" scoped>
::v-deep {
  .transaction-item-wrapper {
    position: relative;
  }
}

.icon-triangle {
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translate(0, -50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top-left-radius: 1px;
  border-top-right-radius: 1px;
  border-top: 5px solid rgba($color: #000000, $alpha: 0.6);
  &-dark {
    border-top-color: rgba($color: #ffffff, $alpha: 0.7);
  }
}

.total-value {
  text-align: right;
}

.transaction-item {
  min-height: 94px;
}
</style>
