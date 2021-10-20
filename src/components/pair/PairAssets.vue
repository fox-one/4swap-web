<template>
  <div class="pair-assets rounded">
    <pair-asset-item :asset="meta.baseAsset" :amount="meta.base_amount" />
    <pair-asset-item :asset="meta.quoteAsset" :amount="meta.quote_amount" />
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

  get meta() {
    const getPairMeta = this.$utils.pair.getPairMeta;
    const { baseAsset, quoteAsset, base_amount, quote_amount } = getPairMeta(
      this,
      this.pair
    );

    return { baseAsset, quoteAsset, base_amount, quote_amount };
  }
}
export default PairAssets;
</script>

<style lang="scss" scoped>
.pair-assets {
  background: var(--v-greyscale_6-base);
  padding: 16px;
}
</style>
