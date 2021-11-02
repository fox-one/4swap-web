<template>
  <div class="text-center">
    <div class="pa-6">
      <v-img width="110" height="110" :src="image" class="d-inline-block" />
    </div>

    <div class="label-2">{{ text }}</div>

    <route-to-create-action class="mt-8" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import RouteToCreateAction from "../liquidity/RouteToCreateAction.vue";

@Component({
  components: {
    RouteToCreateAction,
  },
})
class EmptyPlaceHolder extends Vue {
  @Prop() searchable!: boolean;

  image =
    this.$config.channel === "lake"
      ? require("@/assets/images/image_empty_pool_lake.png")
      : require("@/assets/images/image_empty_pool_fswap.png");

  get text() {
    return this.searchable ? this.$t("token-not-found") : this.$t("empty");
  }
}
export default EmptyPlaceHolder;
</script>
