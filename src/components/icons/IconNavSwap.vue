<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    class="icon"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.9327 7.5C21.6154 8.85259 22 10.3814 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C14.7255 2 17.1962 3.09032 19 4.85857V2"
      :stroke="colors[isDark ? 1 : 0]"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M20.9327 7.5C21.6154 8.85259 22 10.3814 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C14.7255 2 17.1962 3.09032 19 4.85857V2"
      stroke="white"
      stroke-opacity="0.1"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 14.5L10.3455 11.0333L13.6545 12.9667L16 9.5"
      :stroke="colors[isDark ? 1 : 0]"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 14.5L10.3455 11.0333L13.6545 12.9667L16 9.5"
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
class IconNavSwap extends Vue {
  isDark = this.$vuetify.theme.dark;

  get active() {
    return this.$parent.$attrs.active ?? false;
  }

  get colors() {
    const activeColor = this.$vuetify.theme.currentTheme.primary;

    return this.active
      ? [activeColor, activeColor]
      : ["rgba(0, 0, 0, .6)", "rgba(255, 255, 255, .7)"];
  }
}
export default IconNavSwap;
</script>

<style lang="scss" scoped>
.icon {
  fill: none;
}
</style>
