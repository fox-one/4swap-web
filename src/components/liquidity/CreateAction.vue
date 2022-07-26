<template>
  <div>
    <create-pool-confirm-modal
      ref="confirmModal"
      :asset1="asset1"
      :asset2="asset2"
      @confirm="requestCreatePool"
    />

    <create-pool-success-modal ref="sccuessModal" @done="handleDone" />

    <f-button
      :disabled="meta.disabled"
      :loading="loading"
      color="primary"
      @click="handlePay"
    >
      {{ $t("pay") }}
    </f-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { v4 as uuid } from "uuid";
import CreatePoolConfirmModal from "./create-pool-confirm-modal/CreatePoolConfirmModal.vue";
import CreatePoolSuccessModal from "./create-pool-success-modal/CreatePoolSuccessModal.vue";

@Component({
  components: {
    CreatePoolConfirmModal,
    CreatePoolSuccessModal,
  },
})
class CreateAction extends Vue {
  @Prop() valid;

  @Prop() pair;

  @Prop() asset1;

  @Prop() asset2;

  loading = false;

  get meta() {
    const isExist = !!this.pair;

    return {
      disabled: !this.valid || !this.asset1 || !this.asset2 || isExist,
    };
  }

  handlePay() {
    this.handleShowConfirmModal();
  }

  async requestCreatePool() {
    this.loading = true;

    try {
      const params = {
        asset1_id: this.asset1?.id ?? "",
        asset2_id: this.asset2?.id ?? "",
        trace_id: uuid(),
      };
      await this.$utils.payment.createPool(this, params);

      this.handleShowSuccessModal();
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }

    this.loading = false;
  }

  handleShowConfirmModal() {
    const modal: any = this.$refs.confirmModal;

    modal.show();
  }

  handleShowSuccessModal() {
    const modal: any = this.$refs.sccuessModal;

    modal.show();
  }

  handleDone() {
    this.$router.back();
  }
}
export default CreateAction;
</script>
