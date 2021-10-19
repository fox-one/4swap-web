<template>
  <v-layout align-center class="information-item my-3">
    <div class="d-flex align-center" @click="handleTitleClick">
      <span class="label-3">{{ title }}</span>
      <v-icon v-if="icon" size="12" class="ml-1">{{ icon }}</v-icon>
    </div>

    <v-spacer />
    <span class="value">{{ value }}</span>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class InformationItem extends Vue {
  @Prop() title!: string;

  @Prop() icon!: string;

  @Prop() value!: string;

  @Prop() titleFn;

  handleTitleClick() {
    if (typeof this.titleFn === "function") {
      this.titleFn();
    }
  }
}
export default InformationItem;
</script>

<style lang="scss" scoped>
.information-item {
  font-weight: 500;
}

.value {
  font-size: 13px;
}
</style>
