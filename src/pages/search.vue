<template>
  <div>
    <f-search-input v-model="filter" autofocus clearable hide-details />

    <search-history v-if="meta.showHistory" class="mt-8" />

    <pool-list v-else searchable recordable :filter="filter" class="mt-6" />
  </div>
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
