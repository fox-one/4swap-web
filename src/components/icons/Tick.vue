<template>
  <svg
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13.7071 4.29289C14.0976 4.68342 14.0976 5.31658 13.7071 5.70711L7.70711 11.7071C7.51957 11.8946 7.26522 12 7 12C6.73478 12 6.48043 11.8946 6.29289 11.7071L2.79289 8.20711C2.40237 7.81658 2.40237 7.18342 2.79289 6.79289C3.18342 6.40237 3.81658 6.40237 4.20711 6.79289L7 9.58579L12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289Z"
      fill="currentColor"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "Tick",
})
class Tick extends Vue {}
export default Tick;
</script>
