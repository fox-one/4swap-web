<template>
  <div class="profit-panel">
    <span class="toggle-icon">
      <v-btn
        fab
        width="24"
        height="24"
        :color="colors.toggle"
        @click="handleToggle"
      >
        <v-icon v-if="expand" size="16"> $FIconMin4P</v-icon>
        <v-icon v-else size="16"> $FIconMax4P </v-icon>
      </v-btn>
    </span>

    <div v-if="!expand" class="profit-panel--thumb">
      <chart-thumb-layout v-bind="$attrs" v-on="$listeners">
        <template #thumb>
          <slot name="thumb" />
        </template>
      </chart-thumb-layout>
    </div>
    <div v-else class="profit-panel--full">
      <chart-layout v-bind="$attrs" v-on="$listeners">
        <template #chart>
          <slot name="chart" />
        </template>
      </chart-layout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ChartLayout from "./ChartLayout.vue";
import ChartThumbLayout from "./ChartThumbLayout.vue";

@Component({
  inheritAttrs: false,
  components: {
    ChartLayout,
    ChartThumbLayout,
  },
})
class ProfitPanelLayout extends Vue {
  @Prop() expand;

  get colors() {
    const dark = this.$vuetify.theme.dark;

    return {
      toggle: dark ? "greyscale_5" : "greyscale_7",
    };
  }

  handleToggle() {
    this.$emit("toggle");
  }
}
export default ProfitPanelLayout;
</script>

<style lang="scss" scoped>
::v-deep {
  .chart-panel {
    background: var(--v-greyscale_6-base);
  }

  .f-segment-control,
  .type-field--switch {
    background: var(--v-greyscale_5-base) !important;
  }
}

.profit-panel {
  position: relative;
}

.toggle-icon {
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 1;
}
</style>
