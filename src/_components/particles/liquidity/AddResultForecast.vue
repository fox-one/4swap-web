<template>
  <v-expand-transition>
    <f-panel v-if="meta.show" class="mt-5 pa-0 py-4 no-border-radius">
      <div class="f-title-1 pl-4">
        {{ $t("predication") }}
      </div>
      <f-info-grid class="pa-0 mt-4" :window-size="2">
        <f-info-grid-item
          v-for="(item, ix) in pannelData"
          :key="ix"
          :index="ix"
          :title="item.title"
          :value="item.value"
          :value-unit="item.valueUnit"
          :value-custom-color="item.valueCustomColor"
          :hint="item.hint"
        />
      </f-info-grid>
    </f-panel>
  </v-expand-transition>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class AddResultForecast extends Vue {
  @Prop() baseAsset!: API.Asset | null;

  @Prop() quoteAsset!: API.Asset | null;

  @Prop() baseAmount!: string;

  @Prop() quoteAmount!: string;

  @Prop() pair!: API.Pair | null;

  @Prop() alreadyHasLiquidity!: boolean;

  get meta() {
    let shares = "";
    const baseAmount = Number(this.pair?.base_amount);
    const quoteAmount = Number(this.pair?.quote_amount);
    let baseSymbol = this.baseAsset?.symbol;
    const basePrice = Number(this.baseAsset?.price ?? 0);
    let quoteSymbol = this.quoteAsset?.symbol;
    const quotePrice = Number(this.quoteAsset?.price ?? 0);
    const isSameSymbol = this.baseAsset && baseSymbol === quoteSymbol;
    if (isSameSymbol) {
      baseSymbol = this.baseAsset?.display_symbol;
      quoteSymbol = this.quoteAsset?.display_symbol;
    }
    if (!this.alreadyHasLiquidity) {
      shares = "100%";
    } else {
      const k = Math.sqrt(baseAmount * quoteAmount);
      const v = Math.sqrt(Number(this.baseAmount) * Number(this.quoteAmount));
      shares = this.$utils.number.toPercent(v / (v + k), false);
    }

    const getPrice = (funds, amount, fundsSymbol, amountSymbol, fundsPrice) => {
      const p = funds / amount;
      const formatNumber = (v) => this.$utils.number.format(v);
      const price = formatNumber({ n: p });
      return `1 ${amountSymbol} : ${price} ${fundsSymbol} (${this.formatFiat(
        p * fundsPrice
      )})`;
    };
    let priceText, reversePriceText;
    if (baseAmount !== 0 && quoteAmount !== 0) {
      reversePriceText = getPrice(
        quoteAmount,
        baseAmount,
        quoteSymbol,
        baseSymbol,
        quotePrice
      );
      priceText = getPrice(
        baseAmount,
        quoteAmount,
        baseSymbol,
        quoteSymbol,
        basePrice
      );
    }

    return {
      shares,
      priceText,
      reversePriceText,
      show:
        this.baseAsset &&
        this.baseAmount &&
        this.quoteAsset &&
        this.quoteAmount,
    };
  }

  get pannelData() {
    return [
      {
        title: `${this.$t("added")} ${this.baseAsset?.symbol}`,
        value: `${this.baseAmount} ${this.baseAsset?.symbol}`,
      },
      {
        title: `${this.$t("added")} ${this.quoteAsset?.symbol}`,
        value: `${this.quoteAmount} ${this.quoteAsset?.symbol}`,
      },
      {
        title: this.$t("ratio"),
        value: this.meta.priceText,
      },
      {
        title: this.$t("liquidity.percent.abbr"),
        value: this.meta.shares,
      },
    ];
  }

  formatFiat(amountUsd, fraction = -1) {
    return this.$utils.number.formatFiat.call(this, this, amountUsd, fraction);
  }
}
export default AddResultForecast;
</script>
