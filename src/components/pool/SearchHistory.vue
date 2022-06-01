<template>
  <div v-if="hasHistory">
    <v-layout align-center>
      <v-flex class="label-1">{{ $t("history") }}</v-flex>

      <span class="greyscale_4--text" @click="handleClear">
        <span>{{ $t("clear") }}</span>
        <v-icon color="greyscale_4">$FIconTrash</v-icon>
      </span>
    </v-layout>

    <div class="history-items">
      <span
        v-for="(item, index) in items"
        :key="index"
        class="history-item"
        @click="handleToDetail(item)"
      >
        {{ item.text }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Sync } from "vuex-pathify";
import { GlobalGetters, GlobalMutations } from "~/store/types";
import PoolList from "./PoolList.vue";

@Component({
  components: {
    PoolList,
  },
})
class SearchHistory extends Vue {
  @Sync("page/pool@search_history") searchHistory;

  get hasHistory() {
    return this.searchHistory.length > 0;
  }

  get items() {
    return this.searchHistory.map((data) => {
      if (data.type === "pair") {
        const { base, quote } = data;
        const getPairByIds = this.$store.getters[GlobalGetters.GET_PAIR_BY_IDS];
        const getPairMeta = this.$utils.pair.getPairMeta;
        const pair = getPairByIds(base, quote);
        const meta = getPairMeta(this, pair);

        return {
          type: "pair",
          text: meta?.symbol ?? "",
          base_asset_id: meta?.base_asset_id,
          quote_asset_id: meta?.quote_asset_id,
        };
      } else if (data.type === "asset") {
        const getAssetById = this.$store.getters[GlobalGetters.GET_ASSET_BY_ID];
        const asset = getAssetById(data.id);

        return {
          type: "asset",
          text: asset?.symbol ?? "",
          id: asset?.id ?? "",
        };
      }
    });
  }

  handleToDetail(item) {
    if (item.type === "asset") {
      this.handleToAssetDetail(item);
    } else {
      this.handleToPairDetail(item);
    }
  }

  handleToPairDetail(item) {
    this.$router.push({
      name: "pair-detail",
      query: {
        base: item.base_asset_id,
        quote: item.quote_asset_id,
        source: "market",
      },
    });

    this.$store.commit(GlobalMutations.SET_POOL_SEARCH_HISTORY, {
      type: "pair",
      base: item.base_asset_id,
      quote: item.quote_asset_id,
    });
  }

  handleToAssetDetail(item) {
    if (!item.id) return;

    this.$router.push({ name: "asset-detail", query: { id: item.id } });
    this.$store.commit(GlobalMutations.SET_POOL_SEARCH_HISTORY, {
      type: "asset",
      id: item.id,
    });
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
        callback: () => {
          this.searchHistory = [];
        },
      },
    });
  }
}
export default SearchHistory;
</script>

<style lang="scss" scoped>
.history-items {
  padding: 16px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .history-item {
    cursor: pointer;
    padding: 8px 16px;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    border-radius: 54px;
    background-color: var(--v-greyscale_6-base);
  }
}
</style>
