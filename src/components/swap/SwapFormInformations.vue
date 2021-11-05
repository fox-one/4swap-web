<template>
  <div v-if="pair && order">
    <base-information-list :items="items" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import PriceImpact from "./PriceImpact.vue";
import Routes from "./Routes.vue";

@Component
class SwapFormInformations extends Vue {
  @Prop() pair!: API.Pair;

  @Prop() order!: API.SwapOrder;

  @Prop() inputAsset!: API.Asset;

  @Prop() outputAsset!: API.Asset;

  priceReverse = false;

  get meta() {
    const getPreOrderMeta = this.$utils.pair.getPreOrderMeta;

    const { inputAsset, outputAsset, order } = this;
    const inputSymbol = inputAsset.symbol;
    const outputSymbol = outputAsset.symbol;
    const {
      priceText,
      reversePriceText,
      minReceivedText,
      feeText,
      price_impact,
      route_assets,
    } = getPreOrderMeta(this, {
      input: inputAsset,
      output: outputAsset,
      order,
    });

    return {
      priceText: this.priceReverse ? reversePriceText : priceText,
      minReceivedText: minReceivedText + " " + outputSymbol,
      feeText: feeText + " " + inputSymbol,
      price_impact,
      route_assets,
    };
  }

  get items() {
    return [
      {
        title: this.$t("price"),
        value: this.meta.priceText,
        icon: "$IconSwitcher",
        titleFn: () => {
          this.priceReverse = !this.priceReverse;
        },
      },
      {
        title: this.$t("tip.label.min-recevied"),
        value: this.meta.minReceivedText,
      },
      {
        title: this.$t("fee"),
        value: this.meta.feeText,
      },
      {
        title: this.$t("swap.price.impact"),
        value: this.$createElement(PriceImpact, {
          props: { value: this.meta.price_impact },
        }),
      },
      {
        title: this.$t("route"),
        value: this.$createElement(Routes, {
          props: { assets: this.meta.route_assets },
        }),
      },
    ];
  }
}
export default SwapFormInformations;
</script>
