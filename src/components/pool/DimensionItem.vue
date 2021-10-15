<template>
  <div :class="classes">
    {{ item.text }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, InjectReactive } from "vue-property-decorator";

@Component
class DimensionItem extends Vue {
  @Prop() item!: { text: string; value: string };

  @InjectReactive()
  current!: string;

  get classes() {
    return {
      "dimension-item": true,
      "dimension-item--active": this.item.value === this.current,
    };
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
  border: 1.5px solid var(--v-greyscale_6-base);
  color: var(--v-greyscale_3-base);
  background: var(--v-greyscale_6-base);

  &--active {
    color: var(--v-greyscale_2-base);
    border: 1.5px solid var(--v-greyscale_2-base);
    background: none;
  }
}
</style>
