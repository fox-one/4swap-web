<template>
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.728 12.9648C8.3155 13.9048 9.6845 13.9048 10.272 12.9648L15.0656 5.295C15.69 4.29593 14.9718 3 13.7936 3H4.20637C3.02822 3 2.30995 4.29593 2.93437 5.295L7.728 12.9648Z"
      :fill="color"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "DownPolygon",
})
class DownPolygon extends Vue {
  get color() {
    return this.$utils.color.getColor(this, -1);
  }
}
export default DownPolygon;
</script>
