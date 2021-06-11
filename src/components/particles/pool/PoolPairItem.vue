<template>
  <intersect-wrapper class="pair-item">
    <f-panel class="pa-0">
      <v-layout align-center class="pa-3" @click="handleToInfo">
        <base-pair-icon
          :base-asset="meta.baseAsset"
          :quote-asset="meta.quoteAsset"
          small
        />
        <v-flex class="ml-2">
          <v-layout align-center>
            <v-layout align-center>
              {{ meta.symbol }}
            </v-layout>
            <div>
              {{ meta.volumeText }}
            </div>
          </v-layout>
          <v-layout align-center>
            <v-flex class="body-2 f-greyscale-3">
              {{ meta.totalValueText }}
            </v-flex>
            <div class="body-2 f-greyscale-3">
              {{ meta.poolTurnoverText }}
            </div>
          </v-layout>
        </v-flex>
      </v-layout>
    </f-panel>
  </intersect-wrapper>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import BigNumber from "bignumber.js";
import IntersectWrapper from "../../base/IntersectWrapper.vue";

@Component({
  components: {
    IntersectWrapper,
  },
})
class PoolPairItem extends Vue {
  @Prop() pair;

  @Getter("global/getAssetById") getAssetById;

  get meta() {
    const simplizeFiat = this.$utils.number.simplizeFiat;

    const baseAsset = this.getAssetById(this.pair.base_asset_id);
    const quoteAsset = this.getAssetById(this.pair.quote_asset_id);

    const totalValueText = simplizeFiat(this, this.pair.totalValue);
    const volumeText = simplizeFiat(this, this.pair.volume_24h);

    const poolTurnover = new BigNumber(this.pair.volume_24h)
      .div(this.pair.totalValue)
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
    };
  }

  handleToInfo() {
    this.$router.push({
      name: "pair-info",
      query: { base: this.meta.baseAsset.id, quote: this.meta.quoteAsset.id },
    });
  }
}
export default PoolPairItem;
</script>

<style lang="scss" scoped>
.pair-item {
  min-height: 68px;
  margin-bottom: 8px;
}
</style>
