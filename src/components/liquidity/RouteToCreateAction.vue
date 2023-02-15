<template>
  <f-button
    v-if="!meta.hide"
    :disabled="meta.disabled"
    color="primary"
    @click="handleToCreate"
  >
    {{ $t("liquidity.create.new-pool") }}
  </f-button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class RouteToCreateAction extends Vue {
  @Prop({ type: Boolean, default: false }) hideWhileNotSupport!: boolean;

  @Prop() asset1;

  @Prop() asset2;

  get meta() {
    const support = this.$config.CHANNEL === "4swap";

    return {
      text: support
        ? this.$t("liquidity.create.new-liquidity-pool")
        : this.$t("liquidity.create.not-support"),
      disabled: !support,
      hide: this.hideWhileNotSupport && !support,
    };
  }

  handleToCreate() {
    this.$router.push({
      name: "liquidity-create",
      query: {
        base: this.asset1?.id ?? "",
        quote: this.asset2?.id ?? "",
      },
    });
  }
}
export default RouteToCreateAction;
</script>
