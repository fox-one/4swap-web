<template>
  <div>
    <div class="asset-amount">
      <f-mixin-asset-logo
        :size="16"
        :logo="meta.logo"
        :chain-logo="meta.chainLogo"
        :chain-size="6"
      />

      <span v-if="!hideSign" class="ml-1">{{ meta.sign }}</span>

      <span class="mr-1">{{ meta.amount }}</span>

      <span>{{ meta.symbol }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
class AssetAmount extends Vue {
  @Prop() asset!: API.Asset;

  @Prop() amount!: string;

  @Prop({ type: Boolean, default: false }) input!: boolean;

  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const amount = this.amount;
    const price = this.asset?.price ?? 0;
    const value = +amount * +price;
    const sign = this.input ? "-" : +amount > 0 ? "+" : "-";

    return {
      sign,
      symbol: this.asset.symbol,
      logo: this.asset.logo,
      chainLogo: this.asset.chain.logo,
      value: toFiat(this, { n: value }),
      amount: this.$utils.number.format({ n: Math.abs(+this.amount), dp: 8 }),
    };
  }
}
export default AssetAmount;
</script>

<style lang="scss" scoped>
.asset-amount {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  margin: 16px 0;
}

.value-now,
.value-then {
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  margin: 16px 0;
  color: var(--v-greyscale_3-base);
}
</style>
