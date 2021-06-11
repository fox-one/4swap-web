<template>
  <div class="pa-4 my-5 f-caption f-greyscale-3">
    <h3 class="f-greyscale-1 mb-2 font-weight-bold">
      {{ $t("liquidity.create.rules.title") }}:
    </h3>
    <p>
      {{ $t("liquidity.create.rules.p1") }}
    </p>
    <p>
      {{ $t("liquidity.create.rules.p2") }}
    </p>
    <p>
      {{ $t("liquidity.create.rules.p3") }}
    </p>
    <p>
      {{ $t("liquidity.create.rules.p4") }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class LiqCreateRules extends Vue {}
export default LiqCreateRules;
</script>
