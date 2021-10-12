<template>
  <f-bottom-sheet
    v-model="dialog"
    :adaptive="true"
    max-width="600"
    nudge-top="-20"
    overlay-opacity="0.9"
    desktop-wapper="menu"
  >
    <template #activator="{ on }">
      <slot name="activator" :on="{ on }">
        <div v-on="on" class="d-flex align-center">
          <v-icon size="80" color="primary" class="mr-2">
            $iconPandoLake
          </v-icon>
          <v-icon size="16" color="primary"> $iconChevronDown </v-icon>
        </div>
      </slot>
    </template>
    <template #title>
      <div class=""></div>
      {{ "Jump To" }}
    </template>

    <div
      v-for="(item, index) in items"
      align-center
      class="pa-4 d-flex align-center body-1"
      :key="index"
      :class="[item.disabled ? 'greyscale_4--text' : 'greyscale_1--text']"
      @click="handleToProduct(item, index)"
    >
      <div class="name">
        {{ item.title }}
      </div>
      <v-spacer />
      <v-icon v-if="item.check" size="20"> {{ $icons.mdiCheck }}</v-icon>
    </div>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class PandoProductionNav extends Vue {
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
        href: "https://rings.pando.im",
      },
    ];
  }

  handleToProduct(item) {
    window.location.href = item.href;
  }
}
export default PandoProductionNav;
</script>

<style lang="scss" scoped>
.name {
  min-width: 160px;
}
</style>
