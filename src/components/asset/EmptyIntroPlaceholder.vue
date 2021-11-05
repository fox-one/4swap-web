<template>
  <div class="text-center">
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
class EmptyIntroPlaceholder extends Vue {}
export default EmptyIntroPlaceholder;
</script>
