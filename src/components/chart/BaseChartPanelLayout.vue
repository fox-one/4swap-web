<template>
  <div class="chart-panel pa-4">
    <div class="chart-type">
      <type-select :types="types" :value.sync="bindType" />
    </div>
    <div class="chart-title mb-10">
      <slot name="title" />
    </div>
    <div class="chart">
      <slot name="chart" />
    </div>
    <div class="chart-duration">
      <duration-select :value.sync="bindDuration" />
    </div>

    <div class="chart-action">
      <slot name="foot" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import TypeSelect from "./TypeSelect.vue";
import DurationSelect from "./DurationSelect.vue";

@Component({
  components: {
    TypeSelect,
    DurationSelect,
  },
})
class BaseChartPanelLayout extends Vue {
  @Prop() types;

  @PropSync("type") bindType;

  @PropSync("duration") bindDuration;
}
export default BaseChartPanelLayout;
</script>

<style lang="scss" scoped>
.chart-panel {
  background: var(--v-third-base);
  border-radius: 8px;

  .chart {
    height: 195px;
  }
}
</style>
