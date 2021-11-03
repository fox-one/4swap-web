<template>
  <div>
    <dimension-item
      v-for="(item, index) in items"
      :key="index"
      :item="item"
      @click.native="handleSelect(item)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, ProvideReactive, Model } from "vue-property-decorator";
import DimensionItem from "./DimensionItem.vue";

export const dimensions = [
  { text: "volume", value: "volume" },
  { text: "volume.24hours", value: "volume_24h" },
  { text: "turnover.24hours", value: "turnOver" },
];

@Component({
  components: {
    DimensionItem,
  },
})
class DimensionList extends Vue {
  @Model("change") value!: string;

  @ProvideReactive()
  get current() {
    return this.value;
  }

  get items() {
    return dimensions.map((x) => {
      return { ...x, text: this.$t(x.text) };
    });
  }

  handleSelect(item) {
    this.$emit("change", item.value);
  }
}
export default DimensionList;
</script>

<style lang="scss" scoped>
.dimension-item {
  margin-right: 8px;

  &:last-child {
    margin-right: 0;
  }
}
</style>
