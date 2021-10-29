<template>
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.152 3.3568C5.54367 2.73013 6.45633 2.73013 6.848 3.3568L10.0438 8.47C10.46 9.13605 9.98119 10 9.19575 10H2.80425C2.01881 10 1.53997 9.13605 1.95625 8.47L5.152 3.3568Z"
      :fill="color"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "UpPolygon",
})
class UpPolygon extends Vue {
  get color() {
    return this.$utils.color.getColor(this, 1);
  }
}
export default UpPolygon;
</script>
