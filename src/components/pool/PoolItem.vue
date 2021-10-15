<template>
  <v-layout align-center class="my-5">
    <base-pair-icon
      :base-asset="meta.baseAsset"
      :quote-asset="meta.quoteAsset"
    />

    <v-flex class="ml-4">
      <div class="font-weight-bold">{{ meta.symbol }}</div>
      <div class="label-3 mt-2 number">{{ meta.priceText }}</div>
    </v-flex>

    <div class="align-self-start font-weight-bold number">
      {{ meta.dataText }}
    </div>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop, InjectReactive } from "vue-property-decorator";
import { getPairMeta } from "@/utils/pair/helper";

@Component
class PoolItem extends Vue {
  @Prop() pair!: API.Pair;

  @InjectReactive()
  reverse!: boolean;

  @InjectReactive()
  dimension!: string;

  get meta() {
    const format = this.$utils.number.format;
    const toPercent = this.$utils.number.toPercent;
    const toFiat = this.$utils.currency.toFiat;

    const meta = getPairMeta(this, this.pair, false);
    const { baseAsset, quoteAsset, price, symbol } = meta;
    const baseSymbol = baseAsset.symbol;
    const quoteSymbol = quoteAsset.symbol;

    const priceFormat = format({ n: price, fixed: true });
    const reversePriceFormat = format({ n: 1 / price, fixed: true });
    const priceText = `1 ${baseSymbol} ≈ ${priceFormat} ${quoteSymbol}`;
    const reversePriceText = `1 ${quoteSymbol} ≈ ${reversePriceFormat} ${baseSymbol}`;

    const data = meta[this.dimension];
    const dataFormat =
      this.dimension === "turnOver"
        ? toPercent({ n: data })
        : toFiat(this, { n: data, short: true });

    return {
      baseAsset,
      quoteAsset,
      symbol,
      priceText: this.reverse ? reversePriceText : priceText,
      dataText: dataFormat,
    };
  }
}
export default PoolItem;
</script>

<style lang="scss" scoped>
.font-weight-bold {
  font-weight: 600 !important;
}
</style>
