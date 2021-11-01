<template>
  <div class="asset-item" :class="{ 'asset-item--input': isInput }">
    <f-mixin-asset-logo
      :size="24"
      :logo="meta.logo"
      :chain-logo="meta.chainLogo"
      class="mr-4"
    />

    <span>{{ meta.symbol }}</span>

    <v-spacer />

    <span>{{ meta.amountText }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class ModalAssetItem extends Vue {
  @Prop() asset!: API.Asset;

  @Prop() amount!: string;

  @Prop({ type: Boolean, default: false }) isInput!: boolean;

  get meta() {
    const format = this.$utils.number.format;
    const attchSign = this.$utils.number.attchSign;

    const amountValue = this.isInput
      ? -Math.abs(+this.amount)
      : +Math.abs(+this.amount);
    const amountText = attchSign({
      n: amountValue,
      text: format({ n: Math.abs(+this.amount), dp: 8 }),
    });

    return {
      amountText,
      logo: this.asset?.logo ?? "",
      chainLogo: this.asset?.chainLogo ?? "",
      symbol: this.asset?.symbol ?? "",
    };
  }
}
export default ModalAssetItem;
</script>

<style lang="scss" scoped>
.asset-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  cursor: pointer;

  &--input {
    color: var(--v-greyscale_3-base);
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
