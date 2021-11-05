<template>
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.59625 0.553942C5.79596 0.280098 6.20451 0.280098 6.40422 0.553942L9.46434 4.75H2.53613L5.59625 0.553942Z"
      :fill="color[0]"
    />
    <path
      d="M5.59625 11.4461C5.79596 11.7199 6.20451 11.7199 6.40422 11.4461L9.46434 7.25H2.53613L5.59625 11.4461Z"
      fill="currentColor"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class SortDesc extends Vue {
  get color() {
    return [this.$vuetify.theme.currentTheme.greyscale_4];
  }
}
export default SortDesc;
</script>
