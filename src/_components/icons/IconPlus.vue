<template>
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="icon"
  >
    <path
      d="M7.57812 10.5625L7.57812 17.4844L10.4219 17.4844L10.4219 10.5625H17.3594L17.3594 7.65625H10.4219V0.734375H7.57812V7.65625H0.671875V10.5625H7.57812Z"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class IconPlus extends Vue {}
export default IconPlus;
</script>

<style lang="scss" scoped>
.icon {
  fill: currentColor;
}
</style>
