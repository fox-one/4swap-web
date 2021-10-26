<template>
  <div>
    <liquidity-added v-if="added" v-bind="$attrs" />
    <liquidity-not-added v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import LiquidityNotAdded from "./LiquidityNotAdded.vue";
import LiquidityAdded from "./LiquidityAdded.vue";

@Component({
  inheritAttrs: false,
  components: {
    LiquidityNotAdded,
    LiquidityAdded,
  },
})
class PairDetailPageBottomAction extends Vue {
  @Prop() added!: boolean;
}
export default PairDetailPageBottomAction;
</script>
