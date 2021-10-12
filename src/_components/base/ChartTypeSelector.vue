<template>
  <f-bottom-sheet v-model="dialog">
    <template #activator="{ on }">
      <f-button
        v-on="on"
        color="f-greyscale-3"
        :class="['chart-type greyscale_6', { active: dialog }]"
      >
        <span class="mr-2 f-body-2">{{ display }}</span>
        <v-icon size="16" class="icon" :color="iconColor">
          {{ $icons.mdiChevronDown }}
        </v-icon>
      </f-button>
    </template>
    <template #title> {{ $t("chart.chart-type.title") }} </template>
    <v-list class="mb-4">
      <v-list-item
        v-for="(item, index) in types"
        :key="index"
        @click="handleSelect(item.value)"
      >
        <v-list-item-icon class="mr-2">
          <v-icon size="20" :class="[{ 'primary--text': isActive(item) }]">{{
            item.icon
          }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title :class="[{ 'primary--text': isActive(item) }]">
          {{ item.text }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Model, Vue, Prop } from "vue-property-decorator";

@Component
class TypeSelector extends Vue {
  @Model("change") value!: string;

  @Prop() types!: { value: string; text: string }[] | null;

  dialog = false;

  get display() {
    return this.types?.find((x) => x.value === this.value)?.text ?? "";
  }

  isActive(t) {
    return t.value === this.value;
  }

  handleSelect(v) {
    this.$emit("change", v);
    this.dialog = false;
  }

  get iconColor() {
    const isDark = this.$store.state.app.dark;

    return isDark ? "#ffffff" : "#000000";
  }
}
export default TypeSelector;
</script>

<style lang="scss" scoped>
.chart-type {
  padding: 0 6px 0 16px !important;
  height: 37px !important;
  border-radius: 8px;
  font-size: 14px !important;
  font-weight: 500 !important;
  display: flex;
  align-items: center;

  &.active .icon {
    transform: rotateZ(180deg);
  }
}
</style>
