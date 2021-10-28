<template>
  <div class="profit-panel">
    <span class="toggle-icon">
      <v-btn
        fab
        width="24"
        height="24"
        color="greyscale_5"
        @click="handleToggle"
      >
        <v-icon v-if="expand" size="16"> $FIconMin4P</v-icon>
        <v-icon v-else size="16"> $FIconMax4P </v-icon>
      </v-btn>
    </span>

    <div v-if="!expand" class="profit-panel--thumb">
      <div class="chart-title">
        <type-select-thumb :types="types" :value.sync="bindType" class="mb-4" />
        <slot name="thumb-title" />
      </div>
      <div class="chart">
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

  expand = false;

  handleToggle() {
    this.expand = !this.expand;
  }
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

.profit-panel {
  position: relative;
}

.profit-panel--thumb {
  border-radius: 8px;
  padding: 16px;
  padding-right: 48px;
  background: var(--v-greyscale_7-base);
  display: flex;
  align-items: center;

  .chart-title {
    flex: 1;
  }

  .chart {
    min-width: 88px;
    max-width: 88px;
    width: 88px;
    height: 55px;
  }
}

.toggle-icon {
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 1;
}
</style>
