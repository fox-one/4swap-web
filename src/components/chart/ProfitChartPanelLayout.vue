<template>
  <div class="profit-panel">
    <div v-if="!expand" class="profit-panel--thumb">
      <div>
        <type-select-thumb :types="types" :value.sync="bindType" />
        <slot name="thumb-title" />
      </div>
      <div>
        <slot name="thumb-chart" />
      </div>
    </div>
    <div v-else class="profit-panel--full">
      <base-chart-panel-layout
        :types="types"
        :type.sync="bindType"
        :duration.sync="bindDuration"
      >
        <template #title>
          <slot name="title" />
        </template>
        <template #chart>
          <slot name="chart" />
        </template>
      </base-chart-panel-layout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from "vue-property-decorator";
import TypeSelectThumb from "./TypeSelectThumb.vue";
import BaseChartPanelLayout from "./BaseChartPanelLayout.vue";

@Component({
  components: {
    TypeSelectThumb,
    BaseChartPanelLayout,
  },
})
class ProfitPanelLayout extends Vue {
  @Prop() types;

  @PropSync("type") bindType;

  @PropSync("duration") bindDuration;

  expand = true;
}
export default ProfitPanelLayout;
</script>

<style lang="scss" scoped>
::v-deep {
  .chart-panel {
    background: var(--v-greyscale_7-base);
  }

  .f-segment-control,
  .type-field {
    background: var(--v-greyscale_6-base) !important;
  }
}
</style>
