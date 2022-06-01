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

      <v-layout align-center justify-center class="mt-3">
        <span class="symbol">{{ meta.symbol }}</span>
        <span class="name">{{ meta.name }}</span>
      </v-layout>
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
    return {
      symbol: this.asset?.symbol ?? "",
      name: this.asset?.name ?? "",
      logo: this.asset?.logo ?? "",
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
  background-color: var(--v-greyscale_6-base);
  padding: 3px 4px;
  margin-left: 10px;
  border-radius: 4px;
}
</style>
