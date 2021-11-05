<template>
  <div class="pair-asset-item" @click="handleToAsset">
    <f-mixin-asset-logo
      :size="24"
      :logo="meta.logo"
      :chain-logo="meta.chainLogo"
      :chain-size="8"
      class="mr-4"
    />

    <span>{{ meta.symbol }}</span>

    <v-spacer />

    <span>{{ meta.amountText }}</span>

    <v-icon size="16" class="ml-4">$FIconChevronRight4P</v-icon>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class PairAssetItem extends Vue {
  @Prop() asset!: API.Asset;

  @Prop() amount!: string;

  get meta() {
    const simplize = this.$utils.number.simplize;

    return {
      amountText: simplize(this, { n: +this.amount }),
      logo: this.asset.logo,
      chainLogo: this.asset.chain.logo,
      symbol: this.asset.symbol,
    };
  }

  handleToAsset() {
    this.$router.push({ name: "asset-detail", query: { id: this.asset.id } });
  }
}
export default PairAssetItem;
</script>

<style lang="scss" scoped>
.pair-asset-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  cursor: pointer;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
