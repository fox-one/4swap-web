<template>
  <f-asset-amount-input
    :value="bindData.amount"
    :asset="bindData.asset"
    :assets="assets"
    hide-details
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #tools="{ messages }">
      <f-asset-input-tools
        :wallet-connected="meta.logged"
        :balance="meta.balanceText"
        :fiat-amount="meta.amountFiatText"
        :messages="messages"
        @connect-wallet="handleConnectWallet"
        @fill="handleFill"
      />
    </template>
  </f-asset-amount-input>
</template>

<script lang="ts">
import { Component, PropSync, Vue, Prop } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";

@Component
class AssetAmountInput extends Vue {
  @PropSync("data") bindData;

  @Prop() assets;

  get meta() {
    const format = this.$utils.number.format;
    const toFiat = this.$utils.currency.toFiat;
    const getters = this.$store.getters;
    const asset = this.bindData.asset;
    const amount = this.bindData?.amount ?? 0;
    const price = asset?.price ?? 0;

    const logged = getters[GlobalGetters.LOGGED];

    const balance = getters[GlobalGetters.GET_BALANCE_BY_ID](
      this.bindData.asset?.id ?? ""
    );
    const balanceText = format({ n: balance });

    const amountFiat = amount * price;
    const amountFiatText = toFiat(this, { n: amountFiat });

    return {
      logged,
      balance,
      balanceText,
      amountFiatText,
    };
  }

  handleFill() {
    this.$emit("input", this.meta.balance);
  }

  handleConnectWallet() {
    this.$utils.account.openAuth(this);
  }
}
export default AssetAmountInput;
</script>
