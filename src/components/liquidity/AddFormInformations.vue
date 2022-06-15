<template>
  <div v-if="pair">
    <base-information-list :items="items" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class AddFormInformations extends Vue {
  @Prop() pair!: API.Pair;

  @Prop() asset1;

  @Prop() asset2;

  priceReverse = false;

  get items() {
    const toPercent = this.$utils.number.toPercent;
    const format = this.$utils.number.format;
    const getPairMeta = this.$utils.pair.getPairMeta;
    const {
      priceText,
      reversePriceText,
      base_amount,
      quote_amount,
      baseAsset,
      liquidity,
      liquidityAsset,
    } = getPairMeta(this, this.pair) || {};
    const hasLiquidity = base_amount && quote_amount;
    const asset1 = this.asset1.asset;
    const asset2 = this.asset2.asset;
    const asset1Amount = this.asset1.amount;
    const asset2Amount = this.asset2.amount;

    let shares = "";
    let lpAmount = 0;

    if (!hasLiquidity) {
      shares = "100%";
    } else {
      const k = Math.sqrt(+base_amount * +quote_amount);
      const v = Math.sqrt(+asset1Amount * +asset2Amount);

      shares = toPercent({ n: (v + k && v / (v + k)) || 0 });
    }

    if (asset1 && asset2) {
      const [inputBaseAmount, inputQuoteAmount] =
        baseAsset?.id === asset1.id
          ? [asset1Amount, asset2Amount]
          : [asset2Amount, asset1Amount];

      if (!hasLiquidity) {
        lpAmount = Math.sqrt(inputBaseAmount * inputQuoteAmount) - 0.001;
      } else {
        lpAmount =
          Math.min(
            inputBaseAmount / +base_amount,
            inputQuoteAmount / +quote_amount
          ) * +(liquidity || 0);
      }
    }

    return [
      {
        title: this.$t("price"),
        value: this.priceReverse ? reversePriceText : priceText,
        icon: "$IconSwitcher",
        titleFn: () => {
          this.priceReverse = !this.priceReverse;
        },
      },
      {
        title: this.$t("liquidity.percent.abbr"),
        value: shares,
      },
      lpAmount && {
        title: "Received",
        value:
          format({ n: lpAmount, dp: 8 }) + " " + liquidityAsset?.symbol ?? "",
      },
    ].filter((v) => !!v);
  }
}
export default AddFormInformations;
</script>
