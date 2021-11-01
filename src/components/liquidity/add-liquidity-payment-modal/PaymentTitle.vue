<template>
  <div>
    <div class="label-1">
      <div>
        <span>{{ $t("step2") }}</span>
        <span class="secondary--text">:</span>
      </div>
      <div>
        {{
          $t("add.liquidity.payment.subtitle", {
            asset1: meta.symbol1,
            asset2: meta.symbol2,
          })
        }}
      </div>
    </div>

    <div v-html="$t('add.liquidity.payment.hint')" class="hint mt-6" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class PaymentTitle extends Vue {
  @Prop() asset1;

  @Prop() asset2;

  get meta() {
    const symbol1 = this.asset1?.asset?.symbol;
    const symbol2 = this.asset2?.asset?.symbol;

    return { symbol1, symbol2 };
  }
}
export default PaymentTitle;
</script>

<style lang="scss" scoped>
.hint {
  line-height: 16px;
  opacity: 0.3;
  font-size: 12px;
  color: var(--v-greyscale_1-base);
}
</style>
