<template>
  <div>
    <div ref="headers" class="pool-headers pb-5">
      <slot name="header" />

      <template v-if="!hideHeaders">
        <pool-dimension-list v-model="dimension" class="my-4" />

        <pool-header @switch="handleSwitch" @sort="handleSort" />
      </template>
    </div>

    <empty-place-holder v-if="meta.empty" :searchable="searchable">
      <template #action>
        <route-to-create-action hide-while-not-support class="mt-8" />
      </template>
    </empty-place-holder>

    <pool-item
      v-for="(item, index) in meta.items"
      :key="index"
      :pair="item"
      @click.native="handleToDetail(item)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GlobalGetters, GlobalMutations } from "@/store/types";
import PoolDimensionList from "./DimensionList.vue";
import RouteToCreateAction from "../liquidity/RouteToCreateAction.vue";
import PoolHeader from "./PoolHeader.vue";
import PoolItem from "./PoolItem.vue";
import EmptyPlaceHolder from "../particles/EmptyPlaceHolder.vue";
import { getPairMeta, filterFn } from "@/utils/pair/helper";
import { Sync } from "vuex-pathify";

@Component({
  components: {
    PoolItem,
    PoolHeader,
    PoolDimensionList,
    EmptyPlaceHolder,
    RouteToCreateAction,
  },
})
class PoolList extends Vue {
  @Sync("page/pool@reverse")
  reverse;

  @Sync("page/pool@sort")
  sort;

  @Sync("page/pool@dimension")
  dimension;

  @Prop({ type: String, default: "" })
  filter!: string;

  @Prop({ type: Boolean, default: false })
  searchable!: string;

  @Prop({ type: Boolean, default: false })
  recordable!: string;

  @Prop({ type: Boolean, default: true })
  sortable!: boolean;

  @Prop({ type: Boolean, default: false })
  hideHeaders!: string;

  @Prop() pairs;

  get meta() {
    const { getters } = this.$store;
    const pairs = this.pairs || getters[GlobalGetters.AVALIABLE_PAIRS];

    let items = pairs.map((x) => getPairMeta(this, x)!);

    if (this.sortable) {
      items = items.sort((a, b) => {
        if (this.sort === "none") {
          return Number(b.volume) - Number(a.volume);
        }

        const v = Number(b[this.dimension]) - Number(a[this.dimension]);

        return this.sort === "asce" ? -v : v;
      });
    }

    if (this.searchable) {
      items = items.filter((x) => filterFn(this.filter, x));
    }

    const empty = items.length === 0;

    return { items, empty };
  }

  handleToDetail(item) {
    this.$router.push({
      name: "pair-detail",
      query: {
        base: item.base_asset_id,
        quote: item.quote_asset_id,
        source: "market",
      },
    });

    if (this.recordable) {
      this.$store.commit(
        GlobalMutations.SET_POOL_SEARCH_HISTORY,
        JSON.stringify({ base: item.base_asset_id, quote: item.quote_asset_id })
      );
    }
  }

  handleSwitch() {
    this.reverse = !this.reverse;
  }

  handleSort(value) {
    this.sort = value;
  }
}
export default PoolList;
</script>

<style lang="scss" scoped>
.pool-headers {
  position: sticky;
  top: 44px;
  background-color: var(--v-greyscale_7-base);
  z-index: 11;
}
</style>
