<template>
  <div class="text-center">
    <div class="label-3">No information about Reborn Coin</div>

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
