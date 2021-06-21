<template>
  <div class="d-flex flex-column align-center mb-5">
    <f-button
      v-if="isLogged"
      rounded
      large
      depressed
      :disabled="!meta.valid || disabled || isPaid"
      color="primary"
      class="px-14 f-title-2"
      @click="handleCreateLiquidity"
    >
      {{ $t(loading ? "paying" : isPaid ? "paid" : "pay") }}
    </f-button>
    <f-button
      v-else
      rounded
      large
      depressed
      color="primary"
      class="px-14 f-title-2"
      @click="handleLogin"
    >
      {{ $t("connect.wallet") }}
    </f-button>
    <liq-create-confirm-modal
      ref="createConfirmModal"
      @confirm="handleConfirm"
    />
    <liq-create-success-modal ref="createSuccessModal" @done="handleDone" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { IAsset, IPair } from "~/services/types/vo";
import LiqCreateConfirmModal from "./LiqCreateConfirmModal.vue";
import LiqCreateSuccessModal from "./LiqCreateSuccessModal.vue";

@Component({
  components: {
    LiqCreateConfirmModal,
    LiqCreateSuccessModal,
  },
})
class LiqCreateAction extends Vue {
  @Prop() pair!: IPair | null;

  @Prop() baseAsset!: IAsset | null;

  @Prop() quoteAsset!: IAsset | null;

  @Prop() costText!: string | null;

  @Prop() disabled!: boolean;

  @Prop() traceId!: string;

  @Prop() costId!: string;

  @Prop() costAmount!: string;

  @Getter("auth/isLogged") isLogged;

  loading = false;

  isPaid = false;

  get meta() {
    const valid = this.baseAsset && this.quoteAsset;
    return {
      valid,
    };
  }

  handleLogin() {
    this.$utils.helper.requestLogin(this);
  }

  handleCreateLiquidity() {
    if (!this.baseAsset || !this.quoteAsset) return;
    const modal = this.$refs.createConfirmModal as any;
    if (modal) {
      modal.show(this.baseAsset, this.quoteAsset, this.costText);
    } else {
      this.handleConfirm();
    }
  }

  /**
   * confirm model click confirm button
   */
  async handleConfirm() {
    const payment = this.$utils.helper.genPaymentUrl;
    const memo = this.$utils.base64.encode(
      JSON.stringify({
        t: "apply",
        p: [this.baseAsset?.id, this.quoteAsset?.id],
      })
    );

    const payUrl = payment({
      memo,
      assetId: this.costId,
      amount: this.costAmount,
      traceId: this.traceId,
      recipient: this.$config.MIXIN_CLIENT_ID,
    });
    window.location.href = payUrl;
    this.loading = true;
    this.requestOrder();
  }

  handleSuccessCreateLiq() {
    const modal = this.$refs.createSuccessModal as any;
    if (modal) {
      modal.show();
    }
  }

  /**
   * success model click done button
   */
  handleDone() {
    const jumpUrl = this.$route.query.jumpUrl;
    window.location.href = jumpUrl as string;
  }

  async requestOrder() {
    try {
      await this.$http.getApplieOrderInfo(this.traceId);
      this.handleSuccessCreateLiq();
      this.loading = false;
      this.isPaid = true;
    } catch (error) {
      if (error.code !== 404) {
        this.loading = false;
        this.$utils.helper.errorHandler(this, error);
      } else {
        setTimeout(() => this.requestOrder(), 2000);
      }
    }
  }
}
export default LiqCreateAction;
</script>
