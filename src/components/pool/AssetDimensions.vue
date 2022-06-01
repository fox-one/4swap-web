<template>
  <dimension-list
    v-model="dimension"
    :dimensions="dimensions"
    :sort="sort"
    @sort="handleSort"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DimensionList from "./DimensionList.vue";
import { Sync } from "vuex-pathify";

@Component({
  components: {
    DimensionList,
  },
})
class AssetDimensions extends Vue {
  @Sync("page/pool@dimension_asset") dimension;

  @Sync("page/pool@sort_asset") sort;

  dimensions = [
    { text: this.$t("price"), value: "price", sortable: true },
    { text: this.$t("volume.24hours"), value: "volume_24h", sortable: true },
    { text: this.$t("liquidity"), value: "liquidity", sortable: true },
  ];

  handleSort(value) {
    this.sort = value;
  }
}
export default AssetDimensions;
</script>
