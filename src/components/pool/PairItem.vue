<template>
  <div v-intersect="onIntersect" class="pool-item__wrapper">
    <v-layout v-if="isActive" align-center class="pool-item">
      <v-lazy min-width="64" transition="">
        <base-pair-icon
          :base-asset="meta.baseAsset"
          :quote-asset="meta.quoteAsset"
        />
      </v-lazy>

      <v-flex class="ml-4">
        <v-layout>
          <v-flex class="symbol">
            {{ meta.symbol }}
          </v-flex>
          <span class="number value">{{ meta.dataText }}</span>
        </v-layout>

        <div class="label-3 mt-2">
          {{ meta.priceText }}
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getPairMeta } from "@/utils/pair/helper";
import { Sync } from "vuex-pathify";

@Component
class PairItem extends Vue {
  @Prop() pair!: API.Pair;

  @Sync("page/pool@reverse")
  reverse!: boolean;

  @Sync("page/pool@dimension_pair") dimension!: string;

  isActive = false;

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

  onIntersect(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver,
    isIntersecting: boolean
  ) {
    this.isActive = isIntersecting;
  }
}
export default PairItem;
</script>

<style lang="scss" scoped>
.font-weight-bold {
  font-weight: 600 !important;
}

.pool-item__wrapper {
  min-height: 72px;
}

.pool-item {
  padding: 14px 0;

  .symbol,
  .value {
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
