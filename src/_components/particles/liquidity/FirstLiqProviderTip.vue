<template>
  <v-expand-transition>
    <f-tip v-if="meta.show" type="warning" class="mt-5 rounded">
      <div class="pb-1">
        {{ $t("liquidity.first-provider.title") }}
      </div>
      <div class="pb-1">
        {{ $t("liquidity.first-provider.content.p1") }}
      </div>
      <div>
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
class FirstLiqProviderTip extends Vue {
  @Prop() alreadyHasLiquidity!: boolean;

  @Prop() baseAsset!: API.Asset | null;

  @Prop() quoteAsset!: API.Asset | null;

  @Prop() pair!: API.Pair | null;

  get meta() {
    return {
      show: this.baseAsset && this.quoteAsset && !this.alreadyHasLiquidity,
    };
  }
}
export default FirstLiqProviderTip;
</script>
