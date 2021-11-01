<template>
  <v-layout align-center class="pa-6">
    <f-mixin-asset-logo
      :size="40"
      :logo="meta.logo"
      :chain-logo="meta.chainLogo"
      class="mr-4"
    />

    <div class="amount">
      <span>{{ meta.amountText }}</span>
      <span>{{ meta.symbol }}</span>
    </div>

    <v-spacer />

    <payment-action :data="data" v-bind="$attrs" v-on="$listeners" />
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PaymentAction from "./PaymentAction.vue";

@Component({
  components: {
    PaymentAction,
  },
})
class PaymentItem extends Vue {
  @Prop() data;

  get meta() {
    const amount = this.data?.amount;
    const amountText = this.$utils.number.format({ n: amount, dp: 8 });

    return {
      amountText,
      logo: this.data?.asset?.logo ?? "",
      chainLogo: this.data?.asset?.chainLogo ?? "",
      symbol: this.data?.asset?.symbol ?? "",
    };
  }
}
export default PaymentItem;
</script>

<style lang="scss" scoped>
.amount {
  font-size: 16px;
  font-weight: 600;
}
</style>
