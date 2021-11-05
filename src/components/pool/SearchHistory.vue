<template>
  <div v-if="hasHistory">
    <v-layout align-center>
      <v-flex class="label-1">{{ $t("history") }}</v-flex>

      <v-btn small text class="greyscale_4--text" @click="handleClear">
        <span>{{ $t("clear") }}</span>
        <v-icon color="greyscale_4">$FIconTrash</v-icon>
      </v-btn>
    </v-layout>

    <div>
      <pool-list :pairs="items" :sortable="false" recordable hide-headers />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Sync } from "vuex-pathify";
import { GlobalGetters } from "~/store/types";
import PoolList from "./PoolList.vue";

@Component({
  components: {
    PoolList,
  },
})
class SearchHistory extends Vue {
  @Sync("page/pool@searchHistory") searchHistory;

  get hasHistory() {
    return this.searchHistory.length > 0;
  }

  get items() {
    return this.searchHistory
      .map((x) => {
        const { base, quote } = JSON.parse(x);
        const getPairByIds = this.$store.getters[GlobalGetters.GET_PAIR_BY_IDS];
        const getPairMeta = this.$utils.pair.getPairMeta;
        const pair = getPairByIds(base, quote);

        return getPairMeta(this, pair);
      })
      .filter((x) => !!x);
  }

  handleClear() {
    const h = this.$createElement;

    this.$uikit.dialog.show({
      title: this.$t("delete.all.history") as string,
      text: h("div", { staticClass: "text-center" }, [
        this.$t("delete.all.history.text") as string,
      ]),
      confirm: {
        props: { color: "error" },
        text: this.$t("delete") as string,
        callback: () => (this.searchHistory = []),
      },
    });
  }
}
export default SearchHistory;
</script>
