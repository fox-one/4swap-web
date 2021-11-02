<template>
  <div>
    <remove-liquidity-success-modal ref="removeModal" :pair="pair" />

    <f-button
      :disabled="meta.disabled"
      :loading="loading"
      color="primary"
      @click="handleRemove"
    >
      {{ $t("next") }}
    </f-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import RemoveLiquiditySuccessModal from "./remove-liquidity-success-modal/RemoveLiquiditySuccessModal.vue";
import { v4 as uuid } from "uuid";

@Component({
  components: {
    RemoveLiquiditySuccessModal,
  },
})
class RemoveAction extends Vue {
  @Prop() valid;

  @Prop() data;

  @Prop() pair;

  loading = false;

  get meta() {
    const disabled = !this.valid;

    return { disabled };
  }

  async handleRemove() {
    const params = {
      follow_id: uuid(),
      amount: this.data?.amount ?? "",
      asset_id: this.data?.asset.id ?? "",
    };

    this.loading = true;

    try {
      await this.$utils.payment.removeLiquidity(this, params, {
        onSuccess: () => {
          this.handleRemoveSuccess(params.follow_id);
        },
        checker: () =>
          this.$utils.payment.checkTransaction(
            this,
            this.pair?.base_asset_id,
            this.pair?.quote_asset_id,
            params.follow_id
          ),
      });
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }

    this.loading = false;
  }

  handleRemoveSuccess(follow) {
    const modal: any = this.$refs.removeModal;

    modal.show(follow);
  }
}
export default RemoveAction;
</script>
