<template>
  <svg
    width="6"
    height="8"
    viewBox="0 0 6 8"
    class="icon"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.48532 4.3962C5.74532 4.19605 5.74532 3.80395 5.48532 3.6038L2.305 1.15559C1.97621 0.902487 1.5 1.13687 1.5 1.55179L1.5 6.44821C1.5 6.86313 1.97621 7.09751 2.305 6.84441L5.48532 4.3962Z"
      :fill="colors[0]"
    />
    <path
      d="M5.48532 4.3962C5.74532 4.19605 5.74532 3.80395 5.48532 3.6038L2.305 1.15559C1.97621 0.902487 1.5 1.13687 1.5 1.55179L1.5 6.44821C1.5 6.86313 1.97621 7.09751 2.305 6.84441L5.48532 4.3962Z"
      fill="white"
      fill-opacity="0.8"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class IconChevron extends Vue {
  isDark = this.$vuetify.theme.dark;

  get colors() {
    return this.isDark ? ["#9b9c9d"] : ["#666666"];
  }
}
export default IconChevron;
</script>

<style lang="scss" scoped>
.icon {
  fill: none;
}
</style>
