<template>
  <div v-if="meta.asset" class="mx-n4">
    <brief-introduction
      :brief-active.sync="briefActive"
      :info="info"
      :asset="meta.asset"
    />

    <asset-tabs class="asset-tabs" />
    <f-divider opacity="0.05" />

    <div class="pa-4">
      <template v-if="tabIndex === 0">
        <asset-informations
          :asset="meta.asset"
          :pairs="meta.pairs"
          :info="info"
        />
        <f-divider opacity="0.05" class="mb-8 mt-6 mx-n4" />
        <asset-intro :asset="meta.asset" :info="info" />
      </template>

      <template v-if="tabIndex === 1">
        <pair-dimensions />
        <pair-list :pairs="meta.pairs" class="mt-4" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { GlobalGetters } from "@/store/types";
import BriefIntroduction from "@/components/asset/BriefIntroduction.vue";
import AssetInformations from "@/components/asset/AssetInformations.vue";
import AssetTabs from "@/components/asset/AssetTabs.vue";
import AssetIntro from "@/components/asset/AssetIntro.vue";
import PairList from "@/components/pool/PairList.vue";
import PairDimensions from "@/components/pool/AssetDimensions.vue";
import { Sync } from "vuex-pathify";

@Component({
  components: {
    BriefIntroduction,
    AssetInformations,
    AssetIntro,
    AssetTabs,
    PairList,
    PairDimensions,
  },
})
class AssetDetail extends Mixins(mixins.page) {
  @Sync("page/asset@tabIndex") tabIndex!: number;

  id = "";

  info = null;

  briefActive = false;

  get title() {
    return this.briefActive ? "" : this.meta.symbol;
  }

  get htmlTitle() {
    return this.meta.symbol;
  }

  get meta() {
    const getAssetById = this.$store.getters[GlobalGetters.GET_ASSET_BY_ID];
    const getPairsById = this.$store.getters[GlobalGetters.GET_PAIRS_BY_ASSET];

    const asset = getAssetById(this.id);
    const pairs = getPairsById(this.id);

    return {
      asset,
      pairs,
      symbol: asset?.symbol ?? "",
    };
  }

  get appbar() {
    return {
      align: "center",
    };
  }

  @Watch("meta.asset", { immediate: true })
  handleAssetChange(value) {
    try {
      this.info = JSON.parse(value.extra);
    } catch (error) {
      this.info = null;
    }

    this.setPageConfig();
  }

  mounted() {
    this.id = this.$route.query.id as string;
  }

  handleUpdateAsset(asset) {
    this.id = asset?.id ?? "";
  }
}
export default AssetDetail;
</script>

<style lang="scss" scoped>
.asset-tabs {
  position: sticky;
  top: 44px;
  background-color: var(--v-greyscale_7-base);
  z-index: 11;
}
</style>
