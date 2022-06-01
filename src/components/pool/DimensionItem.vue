<template>
  <div :class="classes" @click="handleSelect">
    <span>{{ item.text }}</span>
    <v-icon v-if="meta.showSortIcon" size="12">{{ meta.sortIcon }}</v-icon>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, InjectReactive } from "vue-property-decorator";

@Component
class DimensionItem extends Vue {
  @Prop() item!: { text: string; value: string; sortable?: boolean };

  @Prop() sort!: string;

  @InjectReactive()
  current!: string;

  get meta() {
    const isActive = this.item.value === this.current;
    const sorts = [
      { value: "desc", icon: "$IconSortDesc" },
      { value: "asce", icon: "$IconSortAsce" },
      { value: "none", icon: "$IconSortNone" },
    ];
    const sort = sorts.find((x) => x.value === this.sort);

    return {
      sorts,
      isActive,
      showSortIcon: isActive && this.item.sortable,
      sortIcon: sort?.icon ?? "",
    };
  }

  get classes() {
    return {
      "dimension-item": true,
      "dimension-item--active": this.meta.isActive,
    };
  }

  handleSelect() {
    const sorts = this.meta.sorts;

    if (this.meta.isActive) {
      const currentIndex = sorts.findIndex((x) => x.value === this.sort);
      const next = (currentIndex + 1) % sorts.length;
      const value = sorts[next].value;

      this.$emit("sort", value);
    } else {
      this.$emit("change", this.item.value);
    }
  }
}
export default DimensionItem;
</script>

<style lang="scss" scoped>
.dimension-item {
  font-weight: 500;
  border-radius: 32px;
  padding: 8px 16px;
  font-size: 12px;
  cursor: pointer;
  display: inline-block;
  color: var(--v-greyscale_3-base);
  border: 1.5px solid var(--v-greyscale_6-base);
  background: none;

  &--active {
    border: 1.5px solid var(--v-greyscale_6-base);
    color: var(--v-greyscale_1-base);
    background: var(--v-greyscale_6-base);
  }
}
</style>
