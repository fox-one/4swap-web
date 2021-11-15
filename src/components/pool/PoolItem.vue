<template>
  <v-layout align-center class="pool-item">
    <base-pair-icon
      :base-asset="meta.baseAsset"
      :quote-asset="meta.quoteAsset"
    />

    <v-flex class="ml-4">
      <v-layout>
        <v-flex class="font-weight-bold">
          {{ meta.symbol }}
        </v-flex>
        <span class="number font-weight-bold">{{ meta.dataText }}</span>
      </v-layout>

      <div class="label-3 mt-2 number">
        {{ meta.priceText }}
      </div>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getPairMeta } from "@/utils/pair/helper";
import { Sync } from "vuex-pathify";

@Component
class PoolItem extends Vue {
  @Prop() pair!: API.Pair;

  @Sync("page/pool@reverse")
  reverse!: boolean;

  @Sync("page/pool@dimension")
  dimension!: string;

  get meta() {
    const toPercent = this.$utils.number.toPercent;
    const toFiat = this.$utils.currency.toFiat;

    const meta = getPairMeta(this, this.pair, false)!;
    const { baseAsset, quoteAsset, symbol, priceText, reversePriceText } = meta;

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

.pool-item {
  margin-bottom: 32px;
}
</style>
