<template>
  <svg
    width="6"
    height="12"
    viewBox="0 0 6 12"
    class="icon"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L5 6L1 11"
      :stroke="colors[0]"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class IconChevron extends Vue {
  isDark = this.$vuetify.theme.dark;

  get colors() {
    return this.isDark ? ["#ffffff"] : ["#000000"];
  }
}
export default IconChevron;
</script>

<style lang="scss" scoped>
.icon {
  fill: none;
}
</style>
