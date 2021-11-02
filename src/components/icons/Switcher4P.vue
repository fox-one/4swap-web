<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="12" :fill="colors[1]" />
    <path
      d="M15.0857 7.03151C14.8269 6.70806 14.3549 6.65562 14.0315 6.91438C13.708 7.17313 13.6556 7.6451 13.9144 7.96855L14.9395 9.25003H7.50001C7.08579 9.25003 6.75001 9.58581 6.75001 10C6.75001 10.4142 7.08579 10.75 7.50001 10.75H16.5C16.7883 10.75 17.0511 10.5848 17.176 10.3249C17.3009 10.0651 17.2658 9.75663 17.0857 9.53151L15.0857 7.03151Z"
      :fill="colors[0]"
    />
    <path
      d="M8.91436 16.9685C9.17311 17.292 9.64508 17.3444 9.96853 17.0857C10.292 16.8269 10.3444 16.355 10.0857 16.0315L9.06048 14.75H16.5C16.9142 14.75 17.25 14.4142 17.25 14C17.25 13.5858 16.9142 13.25 16.5 13.25H7.50001C7.2117 13.25 6.94892 13.4153 6.82403 13.6751C6.69914 13.935 6.73425 14.2434 6.91436 14.4685L8.91436 16.9685Z"
      :fill="colors[0]"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "Switcher4P",
})
class Switcher4P extends Vue {
  get colors() {
    return [
      this.$vuetify.theme.currentTheme.greyscale_1,
      this.$vuetify.theme.currentTheme.greyscale_5,
    ];
  }
}
export default Switcher4P;
</script>
