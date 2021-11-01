<template>
  <div>
    <f-bottom-sheet
      v-model="dialog"
      wapper-in-desktop="dialog"
      persistent
      v-bind="$attrs"
      v-on="$listeners"
    >
      <div class="sheet-top">
        <payment-title :asset1="asset1" :asset2="asset2" />
      </div>

      <div>
        <payment-item
          :pair="pair"
          :data="asset1"
          :depositId="depositId"
          :opposite="asset2"
          :paid="asset1Paid"
          @paid="handleAsset1Paid"
        />

        <div class="px-6">
          <f-divider opacity="0.05" />
        </div>

        <payment-item
          :pair="pair"
          :data="asset2"
          :depositId="depositId"
          :opposite="asset1"
          :paid="asset2Paid"
          @paid="handleAsset2Paid"
        />
      </div>
    </f-bottom-sheet>

    <add-liquidity-success-modal
      ref="successModal"
      :pair="pair"
      :asset1="asset1"
      :asset2="asset2"
      :deposit-id="depositId"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import PaymentTitle from "./PaymentTitle.vue";
import PaymentItem from "./PaymentItem.vue";
import AddLiquiditySuccessModal from "../add-liquidity-success-modal/AddLiquiditySuccessModal.vue";
import { v4 as uuid } from "uuid";

@Component({
  components: {
    PaymentTitle,
    PaymentItem,
    AddLiquiditySuccessModal,
  },
})
class AddLiquidityPaymentModal extends Vue {
  @Prop() asset1;

  @Prop() asset2;

  @Prop() pair;

  dialog = false;

  asset1Paid = false;

  asset2Paid = false;

  depositId = uuid();

  show() {
    this.dialog = true;
    this.depositId = uuid();
  }

  handleAsset1Paid() {
    this.asset1Paid = true;
    this.handleCheck();
  }

  handleAsset2Paid() {
    this.asset2Paid = true;
    this.handleCheck();
  }

  async handleCheck() {
    if (this.asset1Paid && this.asset2Paid) {
      try {
        const order = await this.$http.getDepositOrder(this.depositId);

        if (order.state !== "Done") {
          this.$uikit.toast.error({
            message: this.$t("liquidity.add.fail") as any,
          });
        } else {
          this.handleShowSuccessModal();
        }
      } catch (error) {
        this.$utils.helper.errorHandler(this, error);
      }

      this.dialog = false;
    }
  }

  handleShowSuccessModal() {
    const modal: any = this.$refs.successModal;

    modal.show();
  }
}
export default AddLiquidityPaymentModal;
</script>

<style lang="scss" scoped>
.sheet-top {
  padding: 24px;
  border-radius: 8px 8px 0 0;
  background-color: var(--v-third-base);
}
</style>
