<template>
  <div class="type-select" @click="handleChangeType">
    <span class="mr-2">{{ display }}</span>
    <v-icon v-if="showSwitcher" size="16" color="greyscale_3">
      $FIconExchange4P
    </v-icon>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";

@Component
class TypeSelectThumb extends Vue {
  @PropSync("value") bindValue;

  @Prop() types;

  get showSwitcher() {
    return this.types.length > 1;
  }

  get display() {
    return this.types.find((x) => x.value === this.bindValue)?.text;
  }

  handleChangeType() {
    const current = this.types.findIndex((x) => x.value === this.bindValue);
    const next = (current + 1) % this.types.length;

    this.bindValue = this.types[next].value;
  }
}
export default TypeSelectThumb;
</script>

<style lang="scss" scoped>
.type-select {
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: var(--v-greyscale_3-base);
  display: flex;
  align-items: center;
}
</style>
