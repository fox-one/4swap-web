<template>
  <div class="pair-list">
    <empty-place-holder v-if="meta.empty" :searchable="searchable">
      <template #action>
        <route-to-create-action hide-while-not-support class="mt-8" />
      </template>
    </empty-place-holder>

    <pair-item
      v-for="(item, index) in meta.items"
      :key="index"
      :pair="item"
      @click.native="handleToDetail(item)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EmptyPlaceHolder from "../particles/EmptyPlaceHolder.vue";
import RouteToCreateAction from "../liquidity/RouteToCreateAction.vue";
import PairItem from "./PairItem.vue";
import { GlobalGetters, GlobalMutations } from "@/store/types";
import { getPairMeta, filterFn } from "@/utils/pair/helper";
import { Sync } from "vuex-pathify";

@Component({
  components: {
    PairItem,
    EmptyPlaceHolder,
    RouteToCreateAction,
  },
})
class PairList extends Vue {
  @Prop() pairs;

  @Sync("page/pool@sort_pair") sort;

  @Sync("page/pool@dimension_pair") dimension;

  @Prop({ type: Boolean, default: true }) sortable!: boolean;

  @Prop({ type: Boolean, default: false }) searchable!: boolean;

  @Prop({ type: Boolean, default: false }) recordable!: boolean;

  @Prop({ type: Boolean, default: false }) toSwap!: boolean;

  @Prop({ type: String, default: "" }) filter!: string;

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
    if (this.toSwap) {
      const { base_asset_id = "", quote_asset_id = "" } =
        this.$utils.pair.getPairMeta(this, item) || {};
      const [input, output] = [base_asset_id, quote_asset_id];

      this.$router.push({
        name: "swap",
        query: { input, output },
      });
    } else {
      this.$router.push({
        name: "pair-detail",
        query: {
          base: item.base_asset_id,
          quote: item.quote_asset_id,
          source: "market",
        },
      });
    }

    if (this.recordable) {
      this.$store.commit(GlobalMutations.SET_POOL_SEARCH_HISTORY, {
        type: "pair",
        base: item.base_asset_id,
        quote: item.quote_asset_id,
      });
    }
  }
}
export default PairList;
</script>
