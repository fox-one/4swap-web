<template>
  <div
    class="pair-assets rounded"
    :class="{ 'pair-assets--has-detail': showDetailLink }"
  >
    <pair-asset-item :asset="meta.baseAsset" :amount="meta.base_amount" />
    <pair-asset-item :asset="meta.quoteAsset" :amount="meta.quote_amount" />

    <div v-if="showDetailLink" class="details-link">
      <f-divider opacity="0.05" class="mx-n4" />

      <div class="text-center py-5" @click="handleToDetail">
        <v-icon size="16">$FIconUpRight4P</v-icon>
        <span>{{ $t("pool.details") }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import PairAssetItem from "./PairAssetItem.vue";

@Component({
  components: {
    PairAssetItem,
  },
})
class PairAssets extends Vue {
  @Prop() pair!: API.Pair;

  @Prop({ type: Boolean, default: false }) showDetailLink!: boolean;

  get meta() {
    const getPairMeta = this.$utils.pair.getPairMeta;
    const { baseAsset, quoteAsset, base_amount, quote_amount } = getPairMeta(
      this,
      this.pair
    );

    return { baseAsset, quoteAsset, base_amount, quote_amount };
  }

  handleToDetail() {
    this.$router.push({
      name: "pair-detail",
      query: { base: this.pair.base_asset_id, quote: this.pair.quote_asset_id },
    });
  }
}
export default PairAssets;
</script>

<style lang="scss" scoped>
.pair-assets {
  background: var(--v-greyscale_6-base);
  padding: 16px;

  &--has-detail {
    padding-bottom: 0;
  }
}

.details-link {
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
</style>
