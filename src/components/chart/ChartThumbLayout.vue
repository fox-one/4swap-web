<template>
  <div class="chart-panel">
    <f-loading v-if="loading" size="24" />
    <template v-else>
      <div class="chart-title">
        <type-select-thumb :types="types" :value.sync="bindType" class="mb-4" />

        <chart-title :thumb="true" :title="thumbTitle" :hint="thumbHint" />
      </div>
      <div class="chart">
        <slot name="thumb" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import ChartTitle from "./ChartTitle.vue";
import TypeSelectThumb from "./TypeSelectThumb.vue";

@Component({
  inheritAttrs: false,
  components: {
    ChartTitle,
    TypeSelectThumb,
  },
})
class ChartThumbLayout extends Vue {
  @Prop() thumbTitle;

  @Prop() thumbHint;

  @Prop() types;

  @Prop() loading;

  @PropSync("type") bindType;
}
export default ChartThumbLayout;
</script>

<style lang="scss" scoped>
.chart-panel {
  border-radius: 8px;
  padding: 16px;
  padding-right: 48px;
  background: var(--v-greyscale_7-base);
  position: relative;

  .chart {
    position: absolute;
    top: 16px;
    right: 48px;
    width: 88px;
    height: 55px;
  }
}
</style>
