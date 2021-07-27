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
          <v-icon size="68" class="mr-1"> $iconPandoLake </v-icon>
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
      <div>
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
        title: "Pando Lakes",
        check: true,
        disabled: false,
        href: "#",
      },
      {
        title: "Pando Leaf",
        check: false,
        disabled: false,
        href: "https://leaf.pando.im/#/",
      },
      {
        title: "Pando Rings (Coming soon)",
        check: false,
        disabled: true,
        href: "#",
      },
    ];
  }

  handleToProduct(item) {
    window.location.href = item.href;
  }
}
export default PandoProductionNav;
</script>
