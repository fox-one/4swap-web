<template>
  <f-bottom-sheet v-model="dialog" :title="$t('chart')">
    <template #activator="{ on }">
      <div class="type-field" v-on="on">
        <span class="mr-2 f-body-2">{{ display }}</span>
        <v-icon size="16"> $FIconChevronDown4P </v-icon>
      </div>
    </template>

    <base-select-item
      v-for="(item, index) in types"
      :key="index"
      :title="item.text"
      :value="item.value"
      :active="item.value === bindValue"
      @select="handleSelect"
    />
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from "vue-property-decorator";

@Component
class TypeSelect extends Vue {
  @PropSync("value") bindValue;

  @Prop() types;

  dialog = false;

  get display() {
    return this.types.find((x) => x.value === this.bindValue)?.text;
  }

  handleSelect(value) {
    this.dialog = false;
    this.bindValue = value;
  }
}
export default TypeSelect;
</script>

<style lang="scss" scoped>
.type-field {
  display: inline-block;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  padding: 8px 12px;
  background: var(--v-forth-base);
  border-radius: 8px;
}
</style>
