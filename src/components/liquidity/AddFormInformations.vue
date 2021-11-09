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
    const getPairMeta = this.$utils.pair.getPairMeta;
    const { priceText, reversePriceText, base_amount, quote_amount } =
      getPairMeta(this, this.pair) || {};
    const hasLiquidity = base_amount && quote_amount;

    let shares = "";

    if (!hasLiquidity) {
      shares = "100%";
    } else {
      const k = Math.sqrt(+base_amount * +quote_amount);
      const v = Math.sqrt(+this.asset1.amount * +this.asset2.amount);

      shares = toPercent({ n: (v + k && v / (v + k)) || 0 });
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
    ];
  }
}
export default AddFormInformations;
</script>
