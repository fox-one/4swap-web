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
    const toPercent = this.$utils.number.toPercent;

    const pairMeta = getPairMeta(this, this.pair)!;
    const { baseAsset, quoteAsset } = pairMeta;
    const profit: API.PairProfits = getProfitByPair(this, this.pair);
    const getAccountPair = this.$store.getters[GlobalGetters.GET_ACCOUNT_PAIR];
    const { shared } = getAccountPair(this, this.pair);
    const percent = shared?.percent ?? 0;
    const percentText = toPercent({ n: percent });

    const baseAssetSybmol = baseAsset?.symbol ?? "";
    const quoteAssetSymbol = quoteAsset?.symbol ?? "";
    const currBaseAmount = profit?.currentBaseAmount ?? 0;
    const currQuoteAmount = profit?.currentQuoteAmount ?? 0;
    const netBaseAmount = profit?.netBaseAmount ?? 0;
    const netQuoteAmount = profit?.netQuoteAmount ?? 0;
    const diffBaseAmount = currBaseAmount - (profit?.netBaseAmount ?? 0);
    const diffQuoteAmount = currQuoteAmount - (profit?.netQuoteAmount ?? 0);

    return {
      percentText,
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
    const h = this.$createElement;
    const format = this.$utils.number.format;
    const attachSign = this.$utils.number.attachSign;
    const genMultiValue = (data1, data2) => {
      return h("div", { staticClass: "multi-value" }, [
        h("div", [data1]),
        h("div", { staticClass: "mt-2" }, [data2]),
      ]);
    };

    const { baseAssetSybmol, quoteAssetSymbol } = this.meta;
    return [
      {
        title: this.$t("liquidity.percent.abbr"),
        value: this.meta.percentText,
      },
      "divider",
      {
        title: this.$t("liquidity.profits.position"),
        value: genMultiValue(
          format({ n: this.meta.currBaseAmount, dp: 8 }) +
            " " +
            baseAssetSybmol,
          format({ n: this.meta.currQuoteAmount, dp: 8 }) +
            " " +
            quoteAssetSymbol
        ),
        hint: this.$t("liquidity.profits.tooltips.current"),
      },
      {
        title: this.$t("liquidity.profits.added"),
        value: genMultiValue(
          format({ n: this.meta.netBaseAmount, dp: 8 }) + " " + baseAssetSybmol,
          format({ n: this.meta.netQuoteAmount, dp: 8 }) +
            " " +
            quoteAssetSymbol
        ),
      },
      {
        title: this.$t("liquidity.profits.difference"),
        value: genMultiValue(
          attachSign({
            n: this.meta.diffBaseAmount,
            text: format({ n: Math.abs(this.meta.diffBaseAmount), dp: 8 }),
          }) +
            " " +
            baseAssetSybmol,
          attachSign({
            n: this.meta.diffQuoteAmount,
            text: format({ n: Math.abs(this.meta.diffQuoteAmount), dp: 8 }),
          }) +
            " " +
            quoteAssetSymbol
        ),
      },
    ];
  }
}
export default AccountProfitInformations;
</script>

<style lang="scss" scoped>
::v-deep {
  .multi-value {
    text-align: right;
  }
}
</style>
