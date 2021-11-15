<template>
  <v-layout>
    <div @click="$emit('switch')">
      <span class="label-3">{{ $t("pool") }}</span>
      <v-icon size="12">$IconSwitcher</v-icon>
    </div>

    <v-spacer />

    <div @click="handleSort">
      <span class="label-3">{{ $t(meta.dimension.text) }}</span>
      <v-icon size="12">{{ meta.sort.icon }}</v-icon>
    </div>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { dimensions } from "./DimensionList.vue";
import { Sync } from "vuex-pathify";

@Component
class PoolHeader extends Vue {
  @Sync("page/pool@dimension")
  dimension!: string;

  @Sync("page/pool@reverse")
  reverse!: boolean;

  @Sync("page/pool@sort")
  sort!: string;

  get sorts() {
    const sorts = [
      { value: "desc", icon: "$IconSortDesc" },
      { value: "asce", icon: "$IconSortAsce" },
      { value: "none", icon: "$IconSortNone" },
    ];

    if (this.dimension === "volume") {
      return sorts.slice(0, 2);
    }

    return sorts;
  }

  get meta() {
    const dimension = dimensions.find((x) => x.value === this.dimension);
    const sort = this.sorts.find((x) => x.value === this.sort);

    return { dimension, sort };
  }

  @Watch("dimension")
  handleDimensionChange() {
    if (this.dimension === "volume" && this.sort === "none") {
      this.$emit("sort", "desc");
    }
  }

  handleSort() {
    const currentIndex = this.sorts.findIndex((x) => x.value === this.sort);
    const next = (currentIndex + 1) % this.sorts.length;
    const value = this.sorts[next].value;

    this.$emit("sort", value);
  }
}
export default PoolHeader;
</script>
