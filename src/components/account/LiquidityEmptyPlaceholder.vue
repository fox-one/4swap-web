<template>
  <div class="empty-placeholder">
    <div class="logo">
      <v-img height="110" width="110" :src="logo" class="d-inline-block" />
    </div>

    <div class="hint mt-6">
      {{ $t("liquidity.mine.empty") }}
    </div>

    <div>
      <div>
        <f-button color="primary" class="mt-8" @click="handleToAdd">
          <v-icon size="16">$FIconAdd4PBold</v-icon>
          <span class="ml-2">{{ $t("liquidity.add") }}</span>
        </f-button>
      </div>

      <div>
        <f-button text class="mt-4" @click="handleToLearnMore">
          {{ $t("me.learn.more") }}
        </f-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { PANDO_DOC } from "@/constants";

@Component
class LiquidityEmptyPlaceholder extends Vue {
  get logo() {
    return this.$config.CHANNEL === "lake"
      ? require("@/assets/images/image_empty_liquidity_lake.png")
      : require("@/assets/images/image_empty_liquidity_fswap.png");
  }

  handleToAdd() {
    const pair = this.$utils.pair.getMostLiquidityPair(this);

    this.$router.push({
      name: "liquidity-add",
      query: { base: pair.base_asset_id, quote: pair.quote_asset_id },
    });
  }

  handleToLearnMore() {
    location.assign(PANDO_DOC);
  }
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
