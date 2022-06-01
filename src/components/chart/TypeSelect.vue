<template>
  <f-segment-control
    v-model="bindValue"
    borderless
    mandatory
    active-class="primary"
    class="types"
  >
    <f-button
      v-for="(item, index) in types"
      :key="index"
      :ripple="false"
      :value="item.value"
    >
      <span>{{ item.text }}</span>
    </f-button>
  </f-segment-control>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from "vue-property-decorator";

@Component
class TypeSelect extends Vue {
  @PropSync("value") bindValue;

  @Prop() types;

  dialog = false;

  get showSwitcher() {
    return this.types.length > 1;
  }

  get display() {
    return this.types.find((x) => x.value === this.bindValue)?.text;
  }

  handleSelect(value) {
    this.dialog = false;
    this.bindValue = value;
  }

  handleClick(on) {
    if (this.showSwitcher) {
      on.click();
    }
  }
}
export default TypeSelect;
</script>

<style lang="scss" scoped>
.types {
  width: 100%;

  .f-btn {
    flex: 1;
  }
}
</style>
