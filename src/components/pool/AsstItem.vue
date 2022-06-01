<template>
  <div v-intersect="onIntersect" class="asset-item__wrapper">
    <v-layout v-if="isActive" align-center class="asset-item">
      <f-mixin-asset-logo
        :size="36"
        :logo="meta.logo"
        :chain-logo="meta.chainLogo"
      />
      <v-flex class="ml-4">
        <v-layout>
          <v-flex class="font-weight-bold">{{ meta.symbol }}</v-flex>
          <span class="number font-weight-bold">{{ meta.dataText }}</span>
        </v-layout>

        <v-layout class="label-3 mt-2 number">
          <v-flex>{{ meta.name }}</v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Sync } from "vuex-pathify";

@Component
class AssetItem extends Vue {
  @Prop() asset;

  @Sync("page/pool@dimension_asset") dimension!: string;

  isActive = false;

  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const { logo, chain_logo, symbol, name } = this.asset;
    const data = this.asset[this.dimension];
    const dataFormat =
      this.dimension === "price"
        ? toFiat(this, { n: data })
        : toFiat(this, { n: data, short: true });

    return {
      logo,
      name,
      symbol,
      dataText: dataFormat,
      chainLogo: chain_logo,
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
export default AssetItem;
</script>

<style lang="scss" scoped>
.asset-item {
  margin-bottom: 32px;
  cursor: pointer;
}
</style>
