<template>
  <svg
    class="icon"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="10"
      :stroke="colors[0]"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="10"
      stroke="white"
      stroke-opacity="0.1"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 15L8 12"
      :stroke="colors[0]"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 15L8 12"
      stroke="white"
      stroke-opacity="0.1"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12 15V11"
      :stroke="colors[0]"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12 15V11"
      stroke="white"
      stroke-opacity="0.1"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M16 15L16 9"
      :stroke="colors[0]"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M16 15L16 9"
      stroke="white"
      stroke-opacity="0.1"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class IconNavPool extends Vue {
  isDark = this.$vuetify.theme.dark;

  get active() {
    return this.$parent.$attrs.active ?? false;
  }

  get colors() {
    const activeColor = this.$vuetify.theme.currentTheme.primary;
    const inactiveColor = this.$vuetify.theme.currentTheme.greyscale_4;

    return this.active ? [activeColor] : [inactiveColor];
  }
}
export default IconNavPool;
</script>

<style lang="scss" scoped>
.icon {
  fill: none;
}
</style>
