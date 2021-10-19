<template>
  <div v-if="hasHistory">
    <v-layout align-center>
      <v-flex class="label-1">{{ $t("history") }}</v-flex>

      <v-btn small text class="greyscale_4--text">
        <span>{{ $t("clear") }}</span>
        <v-icon color="greyscale_4">$FIconTrash</v-icon>
      </v-btn>
    </v-layout>

    <div>
      <div
        v-for="(text, index) in searchHistory"
        class="history-item"
        :key="index"
      >
        <v-icon>$search</v-icon>
        <span>{{ text }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Sync } from "vuex-pathify";

@Component
class SearchHistory extends Vue {
  @Sync("page/pool@searchHistory") searchHistory;

  get hasHistory() {
    return this.searchHistory.length > 0;
  }

  handleClear() {
    this.$uikit.dialog.show({
      title: "Delete all history ?",
      text: "About to delete all history records. ",
      confirm: {
        text: this.$t("delete") as string,
        callback: () => (this.searchHistory = []),
      },
    });
  }
}
export default SearchHistory;
</script>
