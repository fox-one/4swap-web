<template>
  <div class="pa-4 my-5 f-caption f-greyscale-3">
    <div class="f-greyscale-1 mb-2 font-weight-bold">
      {{ $t("swap.introduction.risk.title") }}:
    </div>
    <div>
      {{ $t("swap.introduction.risk.content") }}
    </div>
    <p />
    <div class="mb-2 f-greyscale-1 font-weight-bold">
      {{ $t("swap.introduction.what.title") }}:
    </div>
    <div>
      {{ $t("swap.introduction.what.content") }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class SwapIntroduction extends Vue {}
export default SwapIntroduction;
</script>
