<template>
  <div>
    <div v-if="!typeDisabled && !useDropdownTypeSelect" class="chart-type mb-4">
      <type-select :types="types" :value.sync="bindType" />
    </div>

    <div class="chart-panel pa-4">
      <div
        v-if="!typeDisabled && useDropdownTypeSelect"
        class="chart-type mb-4"
      >
        <type-dropdown-select :types="types" :value.sync="bindType" />
      </div>

      <div class="chart-title mb-10">
        <chart-title
          :title="title"
          :subtitle="subtitle"
          :hint="hint"
          :label="label"
        />
      </div>
      <div class="chart">
        <slot name="chart" />
      </div>
      <div class="chart-duration">
        <duration-select :value.sync="bindDuration" :durations="durations" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import TypeSelect from "./TypeSelect.vue";
import TypeDropdownSelect from "./TypeDropdownSelect.vue";
import DurationSelect from "./DurationSelect.vue";
import ChartTitle from "./ChartTitle.vue";

@Component({
  inheritAttrs: false,
  components: {
    TypeSelect,
    TypeDropdownSelect,
    DurationSelect,
    ChartTitle,
  },
})
class ChartLayout extends Vue {
  @Prop({ type: Boolean, default: false }) useDropdownTypeSelect!: boolean;

  @Prop() types;

  @Prop() title;

  @Prop() subtitle;

  @Prop() hint;

  @Prop() durations;

  @Prop() label;

  @Prop({ type: Boolean, default: false }) typeDisabled!: boolean;

  @PropSync("type") bindType;

  @PropSync("duration") bindDuration;
}
export default ChartLayout;
</script>

<style lang="scss" scoped>
.chart-panel {
  background: var(--v-third-base);
  border-radius: 8px;

  .chart {
    height: 195px;
    margin: 0 -16px;
  }
}
</style>
