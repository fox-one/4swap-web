<template>
  <div>
    <slot name="action" :on="{ click: handleToSwap }">
      <f-button color="primary" block @click="handleToSwap">
        {{ $t("go.to.swap") }}
      </f-button>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class RouteToSwapAction extends Vue {
  @Prop() pair;

  @Prop() reverse;

  handleToSwap() {
    const { base_asset_id = "", quote_asset_id = "" } =
      this.$utils.pair.getPairMeta(this, this.pair) || {};

    let [input, output] = [base_asset_id, quote_asset_id];

    if (this.reverse) {
      [input, output] = [output, input];
    }

    this.$router.push({
      name: "swap",
      query: { input, output },
    });
  }
}
export default RouteToSwapAction;
</script>
