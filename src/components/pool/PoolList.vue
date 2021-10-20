<template>
  <div>
    <div ref="headers" class="pool-headers">
      <v-layout v-if="!searchable" align-center>
        <v-flex class="label-1">All Pools</v-flex>

        <v-btn icon small height="24" @click="handleSearch">
          <v-icon>$FIconSearch</v-icon>
        </v-btn>
      </v-layout>

      <template v-if="!searchable || !meta.empty">
        <pool-dimension-list v-model="dimension" class="my-4" />

        <pool-header @switch="handleSwitch" @sort="handleSort" />
      </template>
    </div>

    <empty-place-holder v-if="meta.empty" :searchable="searchable" />

    <pool-item
      v-for="(item, index) in meta.items"
      :key="index"
      :pair="item"
      @click.native="handleToDetail(item)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, ProvideReactive, Prop } from "vue-property-decorator";
import { GlobalGetters, GlobalMutations } from "@/store/types";
import PoolDimensionList from "@/components/pool/DimensionList.vue";
import PoolHeader from "./PoolHeader.vue";
import PoolItem from "./PoolItem.vue";
import EmptyPlaceHolder from "./EmptyPlaceHolder.vue";
import { getPairMeta, filterFn } from "@/utils/pair/helper";

export const sorts = [
  { value: "asce", icon: "$IconSortAsce" },
  { value: "desc", icon: "$IconSortDesc" },
];

@Component({
  components: {
    PoolItem,
    PoolHeader,
    PoolDimensionList,
    EmptyPlaceHolder,
  },
})
class PoolList extends Vue {
  @ProvideReactive()
  reverse = false;

  @ProvideReactive()
  sort = "desc";

  @ProvideReactive()
  dimension = "volume";

  @Prop({ type: String, default: "" })
  filter!: string;

  @Prop({ type: Boolean, default: false })
  searchable!: string;

  get meta() {
    const { getters } = this.$store;
    const pairs: API.Pair[] = getters[GlobalGetters.AVALIABLE_PAIRS];

    const sorted = pairs
      .map((x) => getPairMeta(this, x))
      .sort((a, b) => {
        const v = Number(b[this.dimension]) - Number(a[this.dimension]);

        return this.sort === "asce" ? -v : v;
      });

    const items = this.searchable
      ? sorted.filter((x) => filterFn(this.filter, x))
      : sorted;

    const empty = items.length === 0;

    return { items, empty };
  }

  handleToDetail(item) {
    this.$router.push({
      name: "pair-detail",
      query: { base: item.base_asset_id, quote: item.quote_asset_id },
    });

    if (this.searchable) {
      this.$store.commit(GlobalMutations.SET_POOL_SEARCH_HISTORY, this.filter);
    }
  }

  handleSwitch() {
    this.reverse = !this.reverse;
  }

  handleSearch() {
    this.$router.push({ name: "search" });
  }

  handleSort() {
    const currentIndex = sorts.findIndex((x) => x.value === this.sort);
    const next = (currentIndex + 1) % sorts.length;

    this.sort = sorts[next].value;
  }
}
export default PoolList;
</script>
