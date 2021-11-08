<template>
  <div>
    <base-information-list :items="items" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GlobalGetters } from "~/store/types";

@Component
class AccountProfitInformations extends Vue {
  @Prop() pair!: API.Pair;

  get meta() {
    const getters = this.$store.getters;
    const getProfitByPair = getters[GlobalGetters.GET_PROFIT_BY_PAIR];
    const getPairMeta = this.$utils.pair.getPairMeta;

    const { baseAsset, quoteAsset } = getPairMeta(this, this.pair) || {};
    const profit: API.PairProfits = getProfitByPair(this.pair);

    const baseAssetSybmol = baseAsset?.symbol ?? "";
    const quoteAssetSymbol = quoteAsset?.symbol ?? "";
    const currBaseAmount = profit?.currentBaseAmount ?? 0;
    const currQuoteAmount = profit?.currentQuoteAmount ?? 0;
    const netBaseAmount = profit?.netBaseAmount ?? 0;
    const netQuoteAmount = profit?.netQuoteAmount ?? 0;
    const diffBaseAmount = currBaseAmount - (profit?.netBaseAmount ?? 0);
    const diffQuoteAmount = currQuoteAmount - (profit?.netQuoteAmount ?? 0);

    return {
      baseAsset,
      quoteAsset,
      baseAssetSybmol,
      quoteAssetSymbol,
      currBaseAmount,
      currQuoteAmount,
      netBaseAmount,
      netQuoteAmount,
      diffBaseAmount,
      diffQuoteAmount,
    };
  }

  get items() {
    const format = this.$utils.number.format;
    const attachSign = this.$utils.number.attachSign;

    const { baseAssetSybmol, quoteAssetSymbol } = this.meta;
    return [
      {
        title: this.$t("liquidity.profits.position") + ` (${baseAssetSybmol})`,
        value: format({ n: this.meta.currBaseAmount, dp: 8 }),
        hint: this.$t("liquidity.profits.tooltips.current"),
      },
      {
        title: this.$t("liquidity.profits.added") + ` (${baseAssetSybmol})`,
        value: format({ n: this.meta.netBaseAmount, dp: 8 }),
      },
      {
        title:
          this.$t("liquidity.profits.difference") + ` (${baseAssetSybmol})`,
        value: attachSign({
          n: this.meta.diffBaseAmount,
          text: format({ n: Math.abs(this.meta.diffBaseAmount), dp: 8 }),
        }),
      },
      "divider",
      {
        title: this.$t("liquidity.profits.position") + ` (${quoteAssetSymbol})`,
        value: format({ n: this.meta.currQuoteAmount, dp: 8 }),
        hint: this.$t("liquidity.profits.tooltips.current"),
      },
      {
        title: this.$t("liquidity.profits.added") + ` (${quoteAssetSymbol})`,
        value: format({ n: this.meta.netQuoteAmount, dp: 8 }),
      },
      {
        title:
          this.$t("liquidity.profits.difference") + ` (${quoteAssetSymbol})`,
        value: attachSign({
          n: this.meta.diffQuoteAmount,
          text: format({ n: Math.abs(this.meta.diffQuoteAmount), dp: 8 }),
        }),
      },
    ];
  }
}
export default AccountProfitInformations;
</script>
