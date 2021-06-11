<template>
  <div class="f-caption f-greyscale-3">
    <p class="mb-2">
      {{ $t("liquidity.add.guide.hint1") }}
    </p>
    <p class="ma-0">
      {{ $t("liquidity.add.guide.hint2") }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class LiqPaymentTip extends Vue {
  hasLPAsset = false;
  @Prop() hasLpAsset;
}
export default LiqPaymentTip;
</script>
