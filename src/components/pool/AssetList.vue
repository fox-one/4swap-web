<template>
  <div class="asset-list">
    <empty-place-holder v-if="meta.empty" :searchable="searchable" />

    <asset-item
      v-for="(item, index) in meta.items"
      :key="index"
      :asset="item"
      @click.native="handleToDetail(item)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GlobalGetters, GlobalMutations } from "~/store/types";
import AssetItem from "./AsstItem.vue";
import EmptyPlaceHolder from "../particles/EmptyPlaceHolder.vue";
import { Sync } from "vuex-pathify";

@Component({
  components: {
    AssetItem,
    EmptyPlaceHolder,
  },
})
class AssetList extends Vue {
  @Prop() pairs;

  @Sync("page/pool@sort_asset") sort;

  @Sync("page/pool@dimension_asset") dimension;

  @Prop({ type: Boolean, default: true }) sortable!: boolean;

  @Prop({ type: Boolean, default: false }) searchable!: string;

  @Prop({ type: Boolean, default: false }) recordable!: string;

  @Prop({ type: String, default: "" }) filter!: string;

  get meta() {
    let items = this.$store.getters[GlobalGetters.AVALIABLE_ASSETS_META];

    if (this.sortable) {
      items = items.sort((a, b) => {
        if (this.sort === "none") {
          return b.price - a.price;
        }

        const v = b[this.dimension] - a[this.dimension];

        return this.sort === "asce" ? -v : v;
      });
    }

    if (this.searchable) {
      const filter = this.filter.toLowerCase();

      items = items.filter((x) => {
        const name = x.name.toLowerCase();
        const symbol = x.symbol.toLowerCase();

        if (!filter) return false;

        return name.includes(filter) || symbol.includes(filter);
      });
    }

    const empty = items.length === 0;

    return { items, empty };
  }

  handleToDetail(item) {
    this.$router.push({ name: "asset-detail", query: { id: item.id } });

    this.$store.commit(GlobalMutations.SET_POOL_SEARCH_HISTORY, {
      type: "asset",
      id: item.id,
    });
  }
}
export default AssetList;
</script>
