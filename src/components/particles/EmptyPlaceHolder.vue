<template>
  <div class="text-center">
    <div class="pa-6">
      <v-img width="110" height="110" :src="image" class="d-inline-block" />
    </div>

    <div class="label-2">{{ text }}</div>

    <slot name="action"></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class EmptyPlaceHolder extends Vue {
  @Prop() searchable!: boolean;

  @Prop() hint!: string;

  get image() {
    return this.$config.CHANNEL === "lake"
      ? require("@/assets/images/image_empty_pool_lake.png")
      : require("@/assets/images/image_empty_pool_fswap.png");
  }

  get text() {
    return this.hint
      ? this.hint
      : this.searchable
      ? this.$t("token.not-found")
      : this.$t("empty");
  }
}
export default EmptyPlaceHolder;
</script>
