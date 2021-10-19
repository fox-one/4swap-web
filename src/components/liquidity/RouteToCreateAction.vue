<template>
  <f-button v-if="!meta.hide" :disabled="meta.disabled" color="primary">
    {{ $t("liquidity.create.new-liquidity-pool") }}
  </f-button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class RouteToCreateAction extends Vue {
  @Prop({ type: Boolean, default: false }) hideWhileNotSupport!: boolean;

  get meta() {
    const support = this.$config.CHANNEL === "4swap";

    return {
      text: support
        ? this.$t("liquidity.create.new-liquidity-pool")
        : this.$t("liquidity.create.not-support"),
      disabed: !support,
      hide: this.hideWhileNotSupport && !support,
    };
  }
}
export default RouteToCreateAction;
</script>
