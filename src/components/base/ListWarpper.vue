<template>
  <div
    class="list-wrapper"
    v-infinite-scroll="loadData"
    infinite-scroll-distance="10"
    infinite-scroll-disabled="disabled"
  >
    <slot />

    <div v-if="loading" class="d-flex justify-center pa-5">
      <f-loading size="28" color="primary" />
    </div>
    <div
      v-else-if="error"
      class="d-flex caption error--text justify-center pa-5"
    >
      {{ $t("error.ocurred") }}
    </div>
    <div
      v-else-if="!empty"
      class="empty-hint text-secondary caption text-center pa-5"
    >
      <div v-if="filter">{{ $t("not-found") }}</div>
      <slot v-else name="empty">
        {{ hint || $t("empty") }}
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class ListWapper extends Vue {
  @Prop({ type: Array, default: [] }) data!: unknown[];

  @Prop({ type: Boolean, default: false }) loading!: boolean;

  @Prop({ type: Boolean, default: false }) error!: boolean;

  @Prop({ type: Boolean, default: false }) ended!: boolean;

  @Prop({ type: String, default: "" }) hint!: string;

  @Prop({ type: String, default: "" }) filter!: string;

  get disabled() {
    return this.loading || this.ended || this.error;
  }

  get empty() {
    const len = this.data?.length ?? 0;
    return len > 0;
  }

  loadData() {
    this.$emit("load");
  }
}
export default ListWapper;
</script>
