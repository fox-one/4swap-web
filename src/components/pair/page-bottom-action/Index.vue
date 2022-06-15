<template>
  <div>
    <route-to-swap-action
      v-if="tabIndex === 0"
      :pair="pair"
      class="liuquidtiy-action"
    />
    <account-liquidity-action
      v-if="tabIndex === 1 && added"
      :pair="pair"
      v-on="$listeners"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Sync } from "vuex-pathify";
import RouteToSwapAction from "../../liquidity/RouteToSwapAction.vue";
import AccountLiquidityAction from "./AccountLiquidityAction.vue";

@Component({
  inheritAttrs: false,
  components: {
    RouteToSwapAction,
    AccountLiquidityAction,
  },
})
class PairDetailPageBottomAction extends Vue {
  @Sync("page/pairDetail@tabIndex") tabIndex!: number;

  @Prop() added!: boolean;

  @Prop() pair;
}
export default PairDetailPageBottomAction;
</script>

<style lang="scss" scoped>
.liuquidtiy-action {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);

  ::v-deep {
    .f-btn {
      box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.36);
    }
  }
}
</style>
