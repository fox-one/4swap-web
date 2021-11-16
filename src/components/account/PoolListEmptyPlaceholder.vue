<template>
  <div class="text-center">
    <div class="pa-6">
      <v-img width="110" height="110" :src="image" class="d-inline-block" />
    </div>

    <div class="label-2">{{ text }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class PoolListPlaceholder extends Vue {
  get image() {
    return this.$config.CHANNEL === "lake"
      ? require("@/assets/images/image_empty_pool_lake.png")
      : require("@/assets/images/image_empty_pool_fswap.png");
  }

  get text() {
    return this.$t("token.not-found");
  }
}
export default PoolListPlaceholder;
</script>
