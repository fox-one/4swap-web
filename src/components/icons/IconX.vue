<template>
  <svg
    width="8"
    height="8"
    viewBox="0 0 8 8"
    class="icon"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="6.12132"
      y="0.121338"
      width="2"
      height="8"
      rx="1"
      transform="rotate(45 6.12132 0.121338)"
      fill="black"
    />
    <rect
      x="6.12132"
      y="0.121338"
      width="2"
      height="8"
      rx="1"
      transform="rotate(45 6.12132 0.121338)"
      fill="white"
      fill-opacity="0.8"
    />
    <rect
      x="7.53553"
      y="5.77808"
      width="2"
      height="8"
      rx="1"
      transform="rotate(135 7.53553 5.77808)"
      fill="black"
    />
    <rect
      x="7.53553"
      y="5.77808"
      width="2"
      height="8"
      rx="1"
      transform="rotate(135 7.53553 5.77808)"
      fill="white"
      fill-opacity="0.8"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class IconX extends Vue {}
export default IconX;
</script>

<style lang="scss" scoped>
.icon {
  fill: none;
}
</style>
