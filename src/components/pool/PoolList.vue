<template>
  <div>
    <div
      ref="headers"
      class="pool-headers pb-4"
      :class="{ 'pool-headers--desktop': isDesktop }"
    >
      <v-layout align-center>
        <pool-tabs />

        <v-btn v-if="!hideSearch" icon small @click="handleSearch">
          <v-icon>$FIconSearch</v-icon>
        </v-btn>
      </v-layout>

      <div v-if="!hideHeaders" class="mt-4">
        <keep-alive>
          <component :is="components.dimension" v-bind="$attrs" />
        </keep-alive>
      </div>
    </div>

    <base-loading v-if="loading" />

    <keep-alive v-else>
      <component :is="components.list" v-bind="$attrs" />
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AssetDimensions from "./AssetDimensions.vue";
import AssetList from "./AssetList.vue";
import PairDimensions from "./PairDimensions.vue";
import PoolTabs from "@/components/pool/PoolTabs.vue";
import PairList from "./PairList.vue";
import { Sync, Get } from "vuex-pathify";

@Component({
  inheritAttrs: false,
  components: {
    AssetDimensions,
    AssetList,
    PairDimensions,
    PairList,
    PoolTabs,
  },
})
class PoolList extends Vue {
  @Sync("page/pool@tabIndex") tabIndex;

  @Get("pool/loading") loading;

  @Prop({ type: Boolean, default: false })
  hideHeaders!: boolean;

  @Prop({ type: Boolean, default: true })
  hideSearch!: boolean;

  get isDesktop() {
    return this.$vuetify.breakpoint.mdAndUp;
  }

  get components() {
    return this.tabIndex === 0
      ? { dimension: "asset-dimensions", list: "asset-list" }
      : { dimension: "pair-dimensions", list: "pair-list" };
  }

  handleSearch() {
    this.$router.push({ name: "search" });
  }
}
export default PoolList;
</script>

<style lang="scss" scoped>
.pool-headers {
  position: sticky;
  top: 44px;
  background-color: var(--v-greyscale_7-base);
  z-index: 11;

  &.pool-headers--desktop {
    top: 64px;
  }
}
</style>
