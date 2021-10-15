<template>
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6" r="6" :fill="colors[1]" />
    <path
      d="M3.54907 4.82812H8.54907L6.54907 2.82812M8.54907 7.32812H3.54907L5.54907 9.32812"
      :stroke="colors[0]"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "Switcher",
})
class Switch extends Vue {
  get colors() {
    return [
      this.$vuetify.theme.currentTheme.greyscale_1,
      this.$vuetify.theme.currentTheme.greyscale_5,
    ];
  }
}
export default Switch;
</script>
