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
class PairDimensions extends Vue {
  @Sync("page/pool@dimension_pair") dimension;

  @Sync("page/pool@sort_pair") sort;

  dimensions = [
    { text: this.$t("liquidity"), value: "volume", sortable: true },
    { text: this.$t("volume.24hours"), value: "volume_24h", sortable: true },
    { text: this.$t("turnover.24hours"), value: "turnOver", sortable: true },
  ];

  handleSort(value) {
    this.sort = value;
  }
}
export default PairDimensions;
</script>
