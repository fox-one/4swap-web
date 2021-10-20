<template>
  <div class="asset-amount">
    <div class="d-flex align-center">
      <f-mixin-asset-logo
        :size="16"
        :logo="meta.logo"
        :chain-logo="meta.chainLogo"
      />

      <span class="ml-2">{{ meta.symbol }}</span>
    </div>

    <div class="mt-1">{{ meta.amount }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
class AssetAmount extends Vue {
  @Prop() asset!: API.Asset;

  @Prop() amount!: string;

  @Prop({ type: Boolean, default: true }) singleLine!: boolean;

  get meta() {
    return {
      symbol: this.asset.symbol,
      logo: this.asset.logo,
      chainLogo: this.asset.chainLogo,
      amount: this.$utils.number.format({ n: this.amount, dp: 8 }),
    };
  }
}
export default AssetAmount;
</script>

<style lang="scss" scoped>
.asset-amount {
  font-size: 12px;
}
</style>
