<template>
  <div class="durations">
    <div
      v-for="(item, index) in items"
      :key="index"
      :ripple="false"
      :value="item.value"
      class="duration-item"
      :class="{ 'duration-item--active': item.value === bindValue }"
      @click="handleSelect(item)"
    >
      <span>{{ item.text }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, PropSync, Vue, Prop } from "vue-property-decorator";
import { getDurationMeta } from "@/enum";

@Component
class DurationSelect extends Vue {
  @PropSync("value") bindValue;

  @Prop() durations;

  get items() {
    return this.durations.map((x) => {
      const meta = getDurationMeta(x);
      return {
        value: x,
        text: this.$t(meta.text),
      };
    });
  }

  handleSelect(item) {
    this.bindValue = item.value;
  }
}
export default DurationSelect;
</script>

<style lang="scss" scoped>
.durations {
  display: flex;
  justify-content: center;
  margin-top: 8px;

  .duration-item {
    font-weight: 500;
    font-size: 12px;
    line-height: 12px;
    width: 32px;
    height: 32px;
    border-radius: 32px;
    color: var(--v-greyscale_1-base);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
    cursor: pointer;

    &--active {
      background: var(--v-greyscale_1-base);
      color: var(--v-greyscale_7-base);
    }
  }
}
</style>
