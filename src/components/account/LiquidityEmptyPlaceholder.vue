<template>
  <div class="empty-placeholder">
    <div class="logo">
      <v-img height="110" width="110" :src="logo" class="d-inline-block" />
    </div>

    <div class="hint mt-6">
      {{ $t("liquidity.mine.empty") }}
    </div>

    <f-button color="primary" class="mt-8">
      <v-icon size="16">$FIconAdd4PBold</v-icon>
      <span class="ml-2">{{ $t("liquidity.add") }}</span>
    </f-button>

    <f-button text class="mt-4">
      {{ $t("me.learn.more") }}
    </f-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class LiquidityEmptyPlaceholder extends Vue {
  logo = require("@/assets/images/image_empty_liquidity.png");
}
export default LiquidityEmptyPlaceholder;
</script>

<style lang="scss" scoped>
.empty-placeholder {
  text-align: center;
  padding-top: 160px;
}

.hint {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.006em;
  color: var(--v-greyscale_2-base);
}
</style>
