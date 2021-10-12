<template>
  <v-lazy min-height="65">
    <f-panel class="pair-item no-border-radius">
      <v-layout
        align-center
        justify-space-between
        class="pa-0"
        @click="handleToInfo"
      >
        <v-flex class="d-flex align-center">
          <div class="pair-item-icon mr-3">
            <base-pair-icon
              :base-asset="meta.baseAsset"
              :quote-asset="meta.quoteAsset"
              small
            />
          </div>
          <div class="pair-item-symbol">
            <div
              class="d-flex align-center f-title-3"
              style="font-weight: 600 !important; line-height: 24px"
            >
              <span>
                {{ meta.baseSymbol }}
              </span>
              <span style="margin: 0 6px"><icon-x /></span>
              <span>
                {{ meta.quoteSymbol }}
              </span>
            </div>
            <div class="f-body-2 f-greyscale-3 mt-1 total-text">
              {{ meta.totalValueText }}
            </div>
          </div>
        </v-flex>
        <v-flex class="d-flex flex-column justify-space-between">
          <div
            class="f-title-3 volume-text"
            style="font-weight: 600 !important"
          >
            {{ meta.volumeText }}
          </div>
          <div class="f-body-2 pool-turnover-text f-greyscale-3 mt-1">
            {{ meta.poolTurnoverText }}
          </div>
        </v-flex>
      </v-layout>
      <i class="pair-item-chevron">
        <icon-chevron />
      </i>
    </f-panel>
  </v-lazy>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { Getter } from "vuex-class";
import BigNumber from "bignumber.js";

@Component
class PoolPairItem extends Vue {
  @Prop() pair;

  @Prop() index!: number;

  @PropSync("expandIndex") bindExpandIndex!: number;

  @Getter("global/getAssetById") getAssetById;

  expand = false;

  isIntersecting = false;

  get meta() {
    const simplizeFiat = this.$utils.number.simplizeFiat;

    const totalValue =
      this.pair.totalValue ??
      new BigNumber(this.pair.base_value)
        .plus(this.pair.quote_value)
        .toNumber();
    const baseAsset = this.getAssetById(this.pair.base_asset_id);
    const quoteAsset = this.getAssetById(this.pair.quote_asset_id);

    const totalValueText = simplizeFiat(this, totalValue);
    const volumeText = simplizeFiat(this, this.pair.volume_24h);

    const poolTurnover = new BigNumber(this.pair.volume_24h)
      .div(totalValue)
      .multipliedBy(100);
    const poolTurnoverText = `${
      poolTurnover.isNaN() ? 0 : poolTurnover.toFixed(2)
    }%`;
    return {
      quoteAsset,
      baseAsset,
      totalValueText,
      volumeText,
      poolTurnoverText,
      symbol: `${baseAsset?.symbol}-${quoteAsset?.symbol}`,
      baseSymbol: baseAsset?.symbol,
      quoteSymbol: quoteAsset?.symbol,
    };
  }

  handleIntersect(_enteries, _observer, isIntersecting) {
    this.isIntersecting = isIntersecting;
  }

  handleToSwap() {
    this.$router.push({
      name: "swap",
      query: { input: this.meta.baseAsset.id, output: this.meta.quoteAsset.id },
    });
  }

  handleToInfo() {
    this.$router.push({
      name: "pair-info",
      query: { base: this.meta.baseAsset.id, quote: this.meta.quoteAsset.id },
    });
  }

  handleExpand() {
    if (this.bindExpandIndex === this.index) {
      this.bindExpandIndex = -1;
      return;
    }
    this.bindExpandIndex = this.index;
  }
}
export default PoolPairItem;
</script>

<style lang="scss" scoped>
.pair-item {
  min-height: 65px;
  position: relative;
  padding: 13px 35px 9px 16px !important;
  &-icon,
  &-symbol {
    display: inline-block;
  }

  &-chevron {
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translate(0, -50%);
  }
}

.volume-text,
.pool-turnover-text {
  text-align: right;
}
.no-border-radius {
  border-radius: 0;
}
</style>
