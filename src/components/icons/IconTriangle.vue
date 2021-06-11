<template>
  <svg
    width="6"
    height="5"
    viewBox="0 0 6 5"
    class="icon"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.6038 4.48532C2.80395 4.74532 3.19605 4.74532 3.3962 4.48532L5.84441 1.305C6.09751 0.976213 5.86313 0.5 5.44821 0.5H0.551788C0.136868 0.5 -0.0975129 0.976213 0.155586 1.305L2.6038 4.48532Z"
      fill="black"
    />
    <path
      d="M2.6038 4.48532C2.80395 4.74532 3.19605 4.74532 3.3962 4.48532L5.84441 1.305C6.09751 0.976213 5.86313 0.5 5.44821 0.5H0.551788C0.136868 0.5 -0.0975129 0.976213 0.155586 1.305L2.6038 4.48532Z"
      fill="white"
      fill-opacity="0.4"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class IconTriangle extends Vue {}
export default IconTriangle;
</script>

<style lang="scss" scoped>
.icon {
  fill: none;
}
</style>
