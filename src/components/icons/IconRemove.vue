<template>
  <svg
    width="17"
    height="4"
    viewBox="0 0 17 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="icon"
  >
    <path d="M16.7656 3.42236V0.578613H0.234375V3.42236H16.7656Z" />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class IconRemove extends Vue {}
export default IconRemove;
</script>

<style lang="scss" scoped>
.icon {
  fill: currentColor;
}
</style>
