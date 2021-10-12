<template>
  <f-button-tabs
    :value="duration"
    borderless
    mandatory
    class="rounded-lg f-body-2"
    active-class="duration-active"
    @change="(v) => $emit('change', v)"
  >
    <template #tabs>
      <f-button
        v-for="(item, index) in items"
        :key="index"
        :value="item.value"
        :min-width="48"
        small
        color="f-greyscale-1"
        active-class="active-btn rounded-lg"
      >
        {{ item.text }}
      </f-button>
    </template>
  </f-button-tabs>
</template>

<script lang="ts">
import { Component, Model, Vue, Prop } from "vue-property-decorator";

@Component
class DurationSelector extends Vue {
  @Model("change") duration!: API.Duration;

  @Prop() durations!: API.Duration[];

  get items() {
    return this.durations.map((x) => {
      const meta = this.$utils.enums.getDurationMeta(x);
      return {
        value: x,
        text: this.$t(meta.text),
      };
    });
  }
}
export default DurationSelector;
</script>

<style lang="scss" scoped>
.active-btn {
  color: #ffffff !important;
  font-weight: 600;
}
</style>
