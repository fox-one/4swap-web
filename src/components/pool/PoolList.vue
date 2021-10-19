<template>
  <div>
    <div ref="headers" class="pool-headers">
      <v-layout align-center>
        <v-flex class="label-1">All Pools</v-flex>
        <v-btn icon small height="24">
          <v-icon>$FIconSearch</v-icon>
        </v-btn>
      </v-layout>

      <pool-dimension-list v-model="dimension" class="my-4" />

      <pool-header @switch="handleSwitch" @sort="handleSort" />
    </div>

    <pool-item v-for="(item, index) in meta.sorted" :key="index" :pair="item" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, ProvideReactive } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";
import PoolDimensionList from "@/components/pool/DimensionList.vue";
import PoolHeader from "./PoolHeader.vue";
import PoolItem from "./PoolItem.vue";
import { getPairMeta } from "@/utils/pair/helper";

export const sorts = [
  { value: "asce", icon: "$IconSortAsce" },
  { value: "desc", icon: "$IconSortDesc" },
];

@Component({
  components: {
    PoolItem,
    PoolHeader,
    PoolDimensionList,
  },
})
class PoolList extends Vue {
  @ProvideReactive()
  reverse = false;

  @ProvideReactive()
  sort = "desc";

  @ProvideReactive()
  dimension = "volume";

  get meta() {
    const { getters } = this.$store;
    const pairs: API.Pair[] = getters[GlobalGetters.AVALIABLE_PAIRS];
    const sorted = pairs
      .map((x) => getPairMeta(this, x))
      .sort((a, b) => {
        const v = Number(b[this.dimension]) - Number(a[this.dimension]);

        return this.sort === "asce" ? -v : v;
      });

    return { sorted };
  }

  handleSwitch() {
    this.reverse = !this.reverse;
  }

  handleSort() {
    const currentIndex = sorts.findIndex((x) => x.value === this.sort);
    const next = (currentIndex + 1) % sorts.length;

    this.sort = sorts[next].value;
  }
}
export default PoolList;
</script>
