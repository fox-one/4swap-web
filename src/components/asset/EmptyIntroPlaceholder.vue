<template>
  <div class="text-center">
    <v-img :src="image" width="110" height="110" class="d-inline-block" />

    <div class="label-3 mt-4">
      {{ $t("coin.no-intro") }}
    </div>

    <contribute-action class="my-6" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContributeAction from "./ContributeAction.vue";

@Component({
  components: {
    ContributeAction,
  },
})
class EmptyIntroPlaceholder extends Vue {
  get image() {
    return this.$config.CHANNEL === "lake"
      ? require("@/assets/images/image_empty_pool_lake.png")
      : require("@/assets/images/image_empty_pool_fswap.png");
  }
}
export default EmptyIntroPlaceholder;
</script>
