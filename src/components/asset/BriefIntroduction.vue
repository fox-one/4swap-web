<template>
  <div
    v-intersect="{
      handler: onIntersect,
      options: { threshold: 0.6 },
    }"
  >
    <div class="text-center">
      <f-mixin-asset-logo
        :size="40"
        :logo="meta.logo"
        :chain-logo="meta.chainLogo"
      />

      <div class="name mt-2">{{ meta.name }} Price</div>
      <div class="price number mt-2">{{ meta.price }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";

@Component({
  inheritAttrs: false,
})
class BriefIntroduction extends Vue {
  @Prop() asset;

  @PropSync("briefActive") isActive;

  get meta() {
    const toFiat = this.$utils.currency.toFiat;

    return {
      symbol: this.asset?.symbol ?? "",
      name: this.asset?.name ?? "",
      logo: this.asset?.logo ?? "",
      price: toFiat(this, { n: this.asset?.price ?? 0 }),
      chainLogo: this.asset?.chain.logo ?? "",
    };
  }

  onIntersect(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver,
    isIntersecting: boolean
  ) {
    this.isActive = isIntersecting;
  }
}
export default BriefIntroduction;
</script>

<style lang="scss" scoped>
.symbol {
  font-size: 25px;
  font-weight: 600;
  line-height: 30px;
  letter-spacing: -0.02em;
}

.name {
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: var(--v-greyscale_3-base);
}

.price {
  font-weight: 700;
  font-size: 20px;
  line-height: 20px;
}
</style>
