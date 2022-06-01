<template>
  <div>
    <dimension-item
      v-for="(item, index) in dimensions"
      :key="index"
      :item="item"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  ProvideReactive,
  Model,
  Prop,
} from "vue-property-decorator";
import DimensionItem from "./DimensionItem.vue";

@Component({
  inheritAttrs: false,
  components: {
    DimensionItem,
  },
})
class DimensionList extends Vue {
  @Model("change") value!: string;

  @Prop() dimensions;

  @ProvideReactive()
  get current() {
    return this.value;
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
