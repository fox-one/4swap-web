<template>
  <f-button
    v-if="!paid"
    color="primary"
    :loading="loading"
    width="95"
    class="btn"
    @click="handlePayment"
  >
    {{ $t("pay") }}
  </f-button>
  <f-button v-else depressed color="greyscale_6" width="95" class="btn">
    <v-icon size="16">$IconTick</v-icon>
  </f-button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { v4 as uuid } from "uuid";

@Component
class PaymentAction extends Vue {
  @Prop() data;

  @Prop() depositId;

  @Prop() opposite;

  @Prop() pair;

  @Prop() paid;

  loading = false;

  get isBase() {
    return this.pair.base_asset_id === this.data?.asset.id;
  }

  async handlePayment() {
    const params = {
      follow_id: this.depositId,
      asset_id: this.data?.asset.id ?? "",
      trace_id: uuid(),
      opposite_asset_id: this.opposite?.asset.id ?? "",
      amount: this.data?.amount ?? "",
    };

    this.loading = true;

    try {
      await this.$utils.payment.addLiquidity(this, params, {
        onSuccess: () => {
          this.$emit("paid");
        },
        checker: () =>
          this.$utils.payment.checkDepositOrder(
            this,
            params.follow_id,
            this.isBase
          ),
      });
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }

    this.loading = false;
  }
}
export default PaymentAction;
</script>

<style lang="scss" scoped>
.btn {
  width: 95px;
}
</style>
