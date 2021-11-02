<template>
  <div>
    <confirm-swap-modal
      ref="confirmSwapModal"
      :input-asset="inputAsset"
      :output-asset="outputAsset"
      :input-amount="inputAmount"
      :output-amount="outputAmount"
      :order="order"
      @confirm="requestSwap"
    />

    <base-connect>
      <f-button
        :disabled="meta.disabled"
        :loading="loading"
        color="primary"
        v-bind="$attrs"
        @click="handleSwap"
      >
        {{ $t("swap") }}
      </f-button>
    </base-connect>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { v4 as uuidv4 } from "uuid";
import ConfirmSwapModal from "./ConfirmSwapModal.vue";

@Component({
  components: {
    ConfirmSwapModal,
  },
})
class SwapAction extends Vue {
  @Prop() valid;

  @Prop() inputAsset!: API.Asset;

  @Prop() outputAsset!: API.Asset;

  @Prop() inputAmount!: string;

  @Prop() outputAmount!: string;

  @Prop() order!: API.SwapOrder;

  loading = false;

  get meta() {
    return {
      disabled: !this.valid,
    };
  }

  handleSwap() {
    this.handleShowConfirmSwapModal();
  }

  async requestSwap() {
    const getPreOrderMeta = this.$utils.pair.getPreOrderMeta;
    const { minReceived } = getPreOrderMeta(this, {
      input: this.inputAsset,
      output: this.outputAsset,
      order: this.order,
    });

    const traceId = uuidv4();
    const params = {
      minimum: minReceived + "",
      routes: this.order.routes,
      pay_asset_id: this.inputAsset!.id,
      fill_asset_id: this.outputAsset!.id,
      follow_id: traceId,
      amount: this.inputAmount,
    };

    this.loading = true;
    try {
      await this.$utils.payment.swap(this, params, {
        onSuccess: () => {
          // this.handleShowSuccessModal();
          this.$uikit.toast.success({ message: "Swap Successfully" });
        },
        onError: () => {
          this.$utils.helper.errorHandler(this, { message: "Rejected" });
        },
        checker: () => this.$utils.payment.checkSwapOrder(this, traceId),
      });
    } catch (error) {
      console.log(error);
      this.$utils.helper.errorHandler(this, error);
    }
    this.loading = false;
  }

  handleShowConfirmSwapModal() {
    const modal: any = this.$refs.confirmSwapModal;

    modal.show();
  }

  handleShowSuccessModal() {
    // const modal = this.$refs.swapSuccessModal as any;
    // modal.show(order);
  }
}
export default SwapAction;
</script>
