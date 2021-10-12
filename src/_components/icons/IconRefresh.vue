<template>
  <svg
    width="14"
    height="12"
    viewBox="0 0 14 12"
    class="icon"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.84564 4L12.6167 4.5C11.9796 2.47145 10.0845 1 7.84564 1H5.84564C3.51139 1 1.55074 2.59956 1 4.76236"
      :stroke="colors[0]"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M3.84436 8.02722L1.07326 7.52722C1.71039 9.55578 3.60553 11.0272 5.84436 11.0272H7.84436C10.1737 11.0272 12.1311 9.43435 12.6865 7.27843"
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
class IconRefresh extends Vue {
  isDark = this.$vuetify.theme.dark;

  get colors() {
    return this.isDark ? ["#ffffff"] : ["#000000"];
  }
}
export default IconRefresh;
</script>

<style lang="scss" scoped>
.icon {
  fill: none;
}
</style>
