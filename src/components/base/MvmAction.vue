<template>
  <pando-mvm-action
    v-if="show"
    color="#F4308E"
    border-color="#FF65AF"
    @add-to-wallet="handleAddAsset"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class MvmAction extends Vue {
  @Prop() asset;

  get show() {
    const channel = this.$store.state.auth.channel;

    return (
      channel === "metamask" ||
      channel === "walletconnect" ||
      channel === "onekey"
    );
  }

  handleAddAsset() {
    const asset = this.asset;

    this.$passport.helper.watchAsset({
      assetId: asset?.id,
      image: asset.logo,
      symbol: asset.symbol,
    });
  }
}
export default MvmAction;
</script>
