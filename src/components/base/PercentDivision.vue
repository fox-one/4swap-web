<template>
  <div class="percent-division">
    {{ text }}
    <span class="symbol">%</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
class PercentDivision extends Vue {
  @Prop() value;

  get text() {
    return (+this.value * 100).toFixed(2);
  }
}
export default PercentDivision;
</script>

<style lang="scss" scoped>
.percent-division {
  display: inline-block;
  font-weight: bold;
  font-size: 25px;
  line-height: 30px;

  .symbol {
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
  }
}
</style>
