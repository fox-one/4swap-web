<template>
  <v-container>
    <f-search-input v-model="filter" clearable />

    <search-history v-if="meta.showHistory" />

    <pool-list v-else :searchable="true" :filter="filter" />
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import SearchHistory from "@/components/pool/SearchHistory.vue";
import PoolList from "@/components/pool/PoolList.vue";

@Component({
  components: {
    SearchHistory,
    PoolList,
  },
})
class SearchPage extends Mixins(mixins.page) {
  filter = "";

  get title() {
    return this.$t("search");
  }

  get appbar() {
    return {
      title: this.$t("search"),
    };
  }

  get meta() {
    const showHistory = !this.filter;

    return {
      showHistory,
    };
  }
}
export default SearchPage;
</script>
