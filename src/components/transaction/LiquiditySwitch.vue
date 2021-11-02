<template>
  <span class="icon">
    <v-icon size="16">$FIconRefresh4P</v-icon>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class LiquiditySwitch extends Vue {}
export default LiquiditySwitch;
</script>

<style lang="scss" scoped>
.icon {
  width: 24px;
  height: 24px;
  border-radius: 24px;
  background-color: var(--v-greyscale_7-base);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
