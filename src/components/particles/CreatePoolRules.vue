<template>
  <div>
    <h3 class="mb-4 label-1">{{ $t("liquidity.create.rules.title") }}</h3>
    <div class="rules">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class CreatePoolRules extends Vue {}
export default CreatePoolRules;
</script>

<style lang="scss" scoped>
.rules {
  font-size: 12px;
  line-height: 150%;
  color: var(--v-greyscale_3-base);

  p {
    margin: 0;
  }
}
</style>
