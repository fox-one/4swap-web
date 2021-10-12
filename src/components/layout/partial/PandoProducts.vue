<template>
  <f-bottom-sheet
    v-model="dialog"
    :adaptive="true"
    :title="$t('common.jump-to')"
  >
    <template #activator="{ on }">
      <slot name="activator" :on="{ on }">
        <div v-on="on" class="d-flex align-center">
          <v-icon size="80" class="icon mr-1"> $FIconRingsBrand </v-icon>
          <v-icon size="16" color="primary"> $FIconChevronDown4P </v-icon>
        </div>
      </slot>
    </template>

    <div
      v-for="(item, index) in items"
      class="item"
      :key="index"
      :class="[item.disabled ? 'greyscale_4--text' : 'greyscale_1--text']"
      @click="handleToProduct(item, index)"
    >
      <div>
        {{ item.title }}
      </div>
      <v-spacer />
      <v-icon v-if="item.check" size="20"> $FIconCheck </v-icon>
    </div>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class PandoProducts extends Vue {
  dialog = false;

  get items() {
    return [
      {
        title: "Pando Lake",
        check: true,
        disabled: false,
        href: "#",
      },
      {
        title: "Pando Leaf",
        check: false,
        disabled: false,
        href: "https://leaf.pando.im",
      },
      {
        title: "Pando Rings",
        check: false,
        disabled: false,
        href: "https://rings.pando.im",
      },
    ];
  }

  handleToProduct(item) {
    window.location.href = item.href;
  }
}
export default PandoProducts;
</script>

<style lang="scss" scoped>
.item {
  min-width: 200px;
  display: flex;
  align-items: center;
  padding: 16px;
}
</style>
