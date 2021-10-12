<template>
  <div class="mt-5">
    <v-layout align-center justify-center style="position: relative">
      <v-flex style="text-align: center">
        <f-button
          rounded
          large
          depressed
          class="px-14 f-title-2"
          color="primary"
          :loading="loading"
          :disabled="!formValid"
          @click="handleRequestPayment"
        >
          {{ meta.submitBtnText }}
        </f-button>
      </v-flex>
      <div class="slippage">
        <slippage-setting />
      </div>
    </v-layout>
    <impact-confirm-modal
      ref="impactConfirmModal"
      :impact="impact"
      :impact-value="impactValue"
      :input-asset="inputAsset"
      :output-asset="outputAsset"
      :pre-order="preOrder"
      @confirm="handleRequestPayment(false)"
    />
    <!-- <qrcode-pay-modal
      ref="QRCodePayModal"
      @paid="(e) => handleConfirmPaid(e)"
    /> -->
    <swap-success-modal ref="swapSuccessModal" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { v4 as uuidv4 } from "uuid";
import ImpactConfirmModal from "./ImpactConfirmModal.vue";
import QRCodePayModal from "./QRCodePayModal.vue";
import SlippageSetting from "./SlippageSetting.vue";
import SwapSuccessModal from "./SwapSuccessModal.vue";
import BigNumber from "bignumber.js";

@Component({
  components: {
    SlippageSetting,
    ImpactConfirmModal,
    SwapSuccessModal,
    "qrcode-pay-modal": QRCodePayModal,
  },
})
class SwapActionBtn extends Vue {
  @Prop() inputAsset!: API.Asset | null;

  @Prop() outputAsset!: API.Asset | null;

  @Prop() pair!: API.Pair | null;

  @Prop() inputAmount!: string;

  @Prop() outputAmount!: string;

  @Prop() preOrder: API.SwapOrder | null = null;

  @Prop() impactValue!: number;

  @Prop() impact!: string;

  loading = false;

  isMixin = this.$utils.helper.isMixin();

  get needAddLiquidity() {
    return this.inputAsset && this.outputAsset && this.pair?.liquidity === "0";
  }

  get meta() {
    const amount = Number(this.preOrder?.amount ?? 0);
    const slippage = Number(this.$store.state.app.settings.slippage) || 0.99;
    const submitBtnText = this.formValid
      ? this.$t("swap")
      : this.$t("enter.amount");
    return {
      submitBtnText,
      shouldShowImpactWarn: Math.abs(this.impactValue) >= 0.05,
      minReceived: new BigNumber(amount).times(slippage).toString(),
    };
  }

  get formValid() {
    return (
      this.outputAsset &&
      this.inputAsset &&
      this.inputAmount &&
      this.outputAmount &&
      this.preOrder
    );
  }

  async handleRequestPayment(checkImpact = true) {
    if (checkImpact && this.meta.shouldShowImpactWarn) {
      const modal = this.$refs.impactConfirmModal as any;
      modal.show();
      return;
    }

    const traceId = uuidv4();
    const isDesktop = this.$utils.helper.isDesktop();
    if (!isDesktop) {
      this.requestPollingOrder(traceId);
    }

    this.loading = true;
    try {
      await this.$utils.payment.swap(
        this,
        {
          minimum: this.meta.minReceived,
          routes: this.preOrder!.routes,
          pay_asset_id: this.inputAsset!.id,
          fill_asset_id: this.outputAsset!.id,
          follow_id: traceId,
          amount: this.inputAmount,
        },
        {
          onPaid: () => this.handleConfirmPaid(traceId),
        }
      );
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
    this.loading = false;
  }

  // handleShowQRCodeModal(text, traceId) {
  //   const modal = this.$refs.QRCodePayModal as any;
  //   if (modal) {
  //     modal.show(text, traceId);
  //   }
  // }

  handleConfirmPaid(traceId) {
    this.requestPollingOrder(traceId);
  }

  handleAddLiquidity() {
    this.$router.push({
      name: "liquidity-add",
      query: {
        base: this.inputAsset?.id,
        quote: this.outputAsset?.id,
      },
    });
  }

  setPaymentParam(param) {
    this.$store.commit("app/SET_PAYING", param);
  }

  async requestPollingOrder(traceId) {
    this.setPaymentParam({ visible: true });
    const continuePolling = () => {
      if (this.$store.state.app.paying.visible === false) return;
      const timer = setTimeout(() => this.requestPollingOrder(traceId), 2000);
      this.setPaymentParam({ timer });
    };
    try {
      const res = await this.$http.getOrder(traceId);
      if (res.state === "Done") {
        this.handleShowSuccessMessage(res);
      } else if (res.state === "Rejected") {
        this.setPaymentParam({ visible: false });
        this.$utils.helper.toast(this, {
          message: this.$t("swap.reject") as string,
          color: "error",
        });
      } else {
        continuePolling();
      }
    } catch (error) {
      continuePolling();
    }
  }

  handleShowSuccessMessage(order: API.SwapOrder) {
    this.$emit("refresh");
    this.setPaymentParam({ visible: false });
    const modal = this.$refs.swapSuccessModal as any;
    if (modal) {
      console.log(order);
      modal.show(order);
    }
  }
}
export default SwapActionBtn;
</script>
<style lang="scss" scoped>
.slippage {
  position: absolute;
  right: 0;
}
</style>
