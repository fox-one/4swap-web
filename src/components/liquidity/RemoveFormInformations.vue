<template>
  <div v-if="pair">
    <remove-ratio :data.sync="bindData" />
    <base-information-list :items="items" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from "vue-property-decorator";
import RemoveRatio from "./RemoveRatio.vue";

@Component({
  components: {
    RemoveRatio,
  },
})
class RemoveFormInformations extends Vue {
  @Prop() pair;

  @PropSync("data") bindData;

  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const format = this.$utils.number.format;
    const toPercent = this.$utils.number.toPercent;
    const getPairMeta = this.$utils.pair.getPairMeta;
    const {
      volume,
      liquidity,
      baseAsset,
      quoteAsset,
      base_amount,
      quote_amount,
    } = getPairMeta(this, this.pair)!;

    const amount = +(this.bindData.amount ?? 0);
    const percent = amount / +liquidity;
    const removeBaseAmount = percent * +base_amount;
    const removeQuoteAmount = percent * +quote_amount;
    const equivaluent = percent * volume;

    return {
      percent,
      baseAssetSymbol: baseAsset.symbol,
      quoteAssetSymbol: quoteAsset.symbol,
      removeBaseAmount: format({ n: removeBaseAmount, dp: 8 }),
      removeQuoteAmount: format({ n: removeQuoteAmount, dp: 8 }),
      percentText: toPercent({ n: percent }),
      equivaluentText: toFiat(this, { n: equivaluent }),
    };
  }

  get items() {
    return [
      {
        title: this.$t("remove") + ` (${this.meta.baseAssetSymbol})`,
        value: this.meta.removeBaseAmount + " " + this.meta.baseAssetSymbol,
      },
      {
        title: this.$t("remove") + ` (${this.meta.quoteAssetSymbol})`,
        value: this.meta.removeQuoteAmount + " " + this.meta.quoteAssetSymbol,
      },
      {
        title: this.$t("equivaluent"),
        value: this.meta.equivaluentText,
      },
      {
        title: this.$t("liquidity.percent.abbr"),
        value: this.meta.percentText,
      },
    ];
  }
}
export default RemoveFormInformations;
</script>
