<template>
  <div>
    <f-button
      block
      rounded
      large
      depressed
      color="primary"
      class="mt-5"
      :disabled="!bindOrder"
      :loading="loading"
      @click="handleCheckResult"
    >
      {{ $t("complete") }}
    </f-button>
    <add-liq-success-modal ref="addSuccessModal" @ok="handleToIndex" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import AddLiqSuccessModal from "./AddLiqSuccessModal.vue";

@Component({
  components: {
    AddLiqSuccessModal,
  },
})
class LiqCompleteAction extends Vue {
  @PropSync("order") bindOrder!: API.DepositOrder;

  @Prop() payment;

  loading = false;

  stateTimer: any = null;

  count = 0;

  beforeDestroy() {
    clearTimeout(this.stateTimer);
  }

  handleCheckResult() {
    this.loading = true;
    this.pullingOrderState();
  }

  pullingOrderState() {
    if (!this.bindOrder) return;

    this.count += 1;
    const complete = this.bindOrder?.state === "Done";

    if (!complete) {
      if (this.count > 5) {
        this.$utils.helper.toast(this, {
          message: this.$t("liquidity.not-added") as string,
          color: "error",
        });
        this.loading = false;
        return;
      }
      this.requestOrder();
      this.stateTimer = setTimeout(() => {
        this.pullingOrderState();
      }, 2000);
    } else {
      this.handleSuccessAddLiq();
      this.loading = false;
    }
  }

  async requestOrder() {
    try {
      const id = this.payment.follow_id;
      this.bindOrder = await this.$http.getDepositOrder(id);
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
  }

  handleSuccessAddLiq() {
    this.$utils.helper.loadWalletAssets(this);
    this.$store.dispatch("global/getAllAddedPairs", {
      brokerId: this.$config.BROKER_ID,
    });
    const modal = this.$refs.addSuccessModal as any;
    if (modal) {
      modal.show(this.bindOrder);
    }
  }

  handleToIndex() {
    this.$router.push({ name: "index" });
  }
}
export default LiqCompleteAction;
</script>
