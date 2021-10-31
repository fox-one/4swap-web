<template>
  <div v-if="meta.asset">
    <brief-introduction :info="info" :asset="meta.asset" />

    <f-divider opacity="0.05" class="mb-8 mx-n4" />

    <div class="label-1">{{ $t("overview") }}</div>
    <asset-informations :asset="meta.asset" :info="info" :pairs="meta.pairs" />

    <f-divider opacity="0.05" class="mb-8 mt-6 mx-n4" />
    <div class="label-1">{{ $t("pools") }}</div>

    <pool-list :pairs="meta.pairs" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { GlobalGetters } from "@/store/types";
import TitleAssetSelect from "@/components/asset/TitleAssetSelect.vue";
import BriefIntroduction from "@/components/asset/BriefIntroduction.vue";
import AssetInformations from "@/components/asset/AssetInformations.vue";
import PoolList from "@/components/pool/PoolList.vue";

@Component({
  components: {
    BriefIntroduction,
    AssetInformations,
    PoolList,
  },
})
class AssetDetail extends Mixins(mixins.page) {
  id = "";

  info = null;

  get title() {
    return this.$createElement(TitleAssetSelect, {
      props: { asset: this.meta.asset },
      on: { "update:asset": this.handleUpdateAsset },
    });
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
