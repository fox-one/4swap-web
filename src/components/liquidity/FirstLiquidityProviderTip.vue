<template>
  <v-expand-transition>
    <f-tip v-if="meta.show" type="text" class="mb-5 rounded">
      <div class="pb-1">
        {{ $t("liquidity.first-provider.title") }}
      </div>
      <div class="pb-1">
        {{ $t("liquidity.first-provider.content.p1") }}
      </div>
      <div class="pb-1">
        {{ $t("liquidity.first-provider.content.p2") }}
      </div>
      <div>
        {{ $t("liquidity.first-provider.content.p3") }}
      </div>
    </f-tip>
  </v-expand-transition>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class FirstLiquidityProviderTip extends Vue {
  @Prop() pair!: API.Pair | null;

  get meta() {
    if (!this.pair) {
      return { show: false };
    }

    const { base_amount, quote_amount } = this.$utils.pair.getPairMeta(
      this,
      this.pair
    )!;
    const hasLiquidity = +base_amount > 0 && +quote_amount > 0;

    return {
      show: !hasLiquidity,
    };
  }
}
export default FirstLiquidityProviderTip;
</script>
