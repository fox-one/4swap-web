<template>
  <div class="empty">
    <v-img :src="logo" width="110" height="110" />
    <div class="hint">{{ hint }}</div>
    <f-button color="primary" @click="$emit('add')">
      <v-icon :size="16" class="mr-1">$FIconAdd4PBold</v-icon>
      {{ $t("liquidity.add") }}
    </f-button>
    <f-button text class="mt-2" @click="handleLearnMore">
      {{ $t("me.learn.more") }}
    </f-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EmptyPlaceHolder from "@/components/particles/EmptyPlaceHolder.vue";
import { PANDO_DOC } from "@/constants";

@Component({
  components: {
    EmptyPlaceHolder,
  },
})
class AccountLiquidityPlaceholder extends Vue {
  @Prop() symbol!: string;

  get logo() {
    return this.$config.CHANNEL === "lake"
      ? require("@/assets/images/image_empty_liquidity_lake.png")
      : require("@/assets/images/image_empty_liquidity_fswap.png");
  }

  get hint() {
    return this.$t("liquidity.empty.hint", { symbol: this.symbol });
  }

  handleLearnMore() {
    location.assign(PANDO_DOC);
  }
}
export default AccountLiquidityPlaceholder;
</script>

<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;

  .hint {
    margin: 24px 0;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: var(--v-greyscale_3-base);
  }
}
</style>
