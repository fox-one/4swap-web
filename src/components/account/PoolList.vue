<template>
  <div>
    <pool-item v-for="(pair, index) in meta.pairs" :key="index" :pair="pair" />

    <pool-list-placeholder v-if="meta.empty" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";
import PoolItem from "./PoolItem.vue";
import PoolListPlaceholder from "./PoolListEmptyPlaceholder.vue";

@Component({
  components: {
    PoolItem,
    PoolListPlaceholder,
  },
})
class PoolList extends Vue {
  @Prop() filter;

  get meta() {
    const accountPairs = this.$store.getters[GlobalGetters.ACCOUNT_PAIRS](this);
    const fitlerFn = this.$utils.pair.filterFn;
    const getPairMeta = this.$utils.pair.getPairMeta;

    const pairs = accountPairs
      .filter((x) => {
        if (this.filter) {
          return fitlerFn(this.filter, getPairMeta(this, x));
        }

        return true;
      })
      .sort((a, b) => {
        return b.shared.totalValue - a.shared.totalValue;
      });
    const empty = pairs.length === 0;

    return {
      pairs,
      empty,
    };
  }
}
export default PoolList;
</script>
