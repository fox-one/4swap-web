<template>
  <v-layout v-if="asset && payment" align-center class="my-5">
    <f-mixin-asset-logo
      class="mr-2"
      :size="30"
      :logo="asset.logo"
      :chainLogo="asset.chainLogo"
    ></f-mixin-asset-logo>
    <v-flex> {{ meta.amount }} </v-flex>
    <v-btn
      v-if="!meta.paid"
      rounded
      small
      color="primary"
      class="px-9 f-title-2"
      style="font-weight: 600 !important"
      fab
      depressed
      @click="handlePayment"
    >
      {{ isLoading ? $t("paying") : $t("pay") }}
    </v-btn>
    <v-btn
      v-else
      rounded
      small
      disabled
      color="primary"
      class="px-9 f-title-2"
      style="color: #ffffff !important; font-weight: 600 !important"
      fab
      depressed
    >
      {{ $t("paid") }}
    </v-btn>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { DepositParams } from "~/utils/payment";

@Component
class LiqPaymentAction extends Vue {
  @PropSync("order") bindOrder!: API.DepositOrder;

  @Prop() payment!: DepositParams;

  @Getter("global/getAssetById") getAssetById;

  timer: any = null;

  isLoading = false;

  get asset() {
    return this.getAssetById(this.payment.asset_id);
  }

  get meta() {
    return {
      paid: this.isPaid(),
      amount: `${this.payment?.amount} ${this.asset?.symbol}`,
      label: this.$t("liquidity.add.symbol", { symbol: this.asset?.symbol }),
    };
  }

  beforeDestroy() {
    clearTimeout(this.timer);
  }

  isPaid() {
    if (!this.bindOrder) return false;

    if (this.bindOrder.base_asset_id == this.payment.asset_id) {
      return Number(this.bindOrder.base_amount) > 0;
    }

    if (this.bindOrder.quote_asset_id == this.payment.asset_id) {
      return Number(this.bindOrder.quote_amount) > 0;
    }

    return false;
  }

  handlePayment() {
    this.isLoading = true;
    this.$utils.payment.deposit(this, this.payment);
    this.pullingTransferStatus();
  }

  async pullingTransferStatus() {
    const continuePolling = () => {
      this.timer = setTimeout(() => {
        this.pullingTransferStatus();
      }, 2000);
    };

    await this.requestOrder();
    const complete = this.isPaid();
    if (!complete) {
      continuePolling();
    } else {
      this.isLoading = false;
      this.$utils.helper.loadWalletAssets(this);
      this.$store.dispatch("global/getAllAddedPairs", {
        brokerId: this.$config.BROKER_ID,
      });
      this.$emit("onPaid", this.payment.trace_id);
    }
  }

  async requestOrder() {
    try {
      const id = this.payment.follow_id;
      this.bindOrder = await this.$http.getDepositOrder(id);
    } catch (error) {
      if (error.code !== 404) {
        this.isLoading = false;
        this.$utils.helper.errorHandler(this, error);
      }
    }
  }
}
export default LiqPaymentAction;
</script>
