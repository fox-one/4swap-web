<template>
  <div class="text-center">
    <base-pair-icon
      :base-asset="meta.baseAsset"
      :quote-asset="meta.quoteAsset"
    />

    <div class="price mt-3">
      <span class="mr-2">{{ meta.priceText }}</span>
      <v-icon size="24" @click="handleSwitch"> $IconSwitcher4P </v-icon>
    </div>

    <div class="fiat mt-3">{{ meta.fiatText }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class PairPrice extends Vue {
  @Prop() pair!: API.Pair;

  reverse = false;

  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const getPairMeta = this.$utils.pair.getPairMeta;
    const {
      baseAsset,
      quoteAsset,
      price,
      priceText,
      reversePriceText,
    } = getPairMeta(this, this.pair)!;
    const fiatAmount = this.reverse
      ? (1 / price) * +baseAsset.price
      : price * +quoteAsset.price;
    const fiatText = toFiat(this, { n: fiatAmount });

    return {
      baseAsset,
      quoteAsset,
      fiatText,
      priceText: this.reverse ? reversePriceText : priceText,
    };
  }

  handleSwitch() {
    this.reverse = !this.reverse;
  }
}
export default PairPrice;
</script>

<style lang="scss" scoped>
.pair-icon {
  justify-content: center;
}

.price {
  font-weight: bold;
  font-size: 20px;
  line-height: 150%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fiat {
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  font-feature-settings: "salt" on;
  color: var(--v-greyscale_3-base);
}
</style>
