<template>
  <v-dialog v-model="dialog" max-width="450">
    <f-panel class="pa-8">
      <div class="label-1 d-flex align-center">
        <v-icon class="mr-1"> $IconCheck </v-icon>

        {{ $t("liquidity.add.success") }}
      </div>

      <div class="mt-6">
        <base-modal-asset-item
          is-input
          :asset="asset1.asset"
          :amount="asset1.amount"
        />
        <base-modal-asset-item
          is-input
          :asset="asset2.asset"
          :amount="asset2.amount"
        />
        <base-modal-asset-item
          v-if="transaction"
          :asset="meta.liquidityAsset"
          :amount="meta.liquidityAmount"
        />
      </div>

      <div class="text-center mt-6">
        <f-button color="primary" @click="handleClose">
          {{ $t("okay") }}
        </f-button>
      </div>
    </f-panel>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";

@Component
class AddLiquiditySuccessModal extends Vue {
  @Prop() pair;

  @Prop() asset1;

  @Prop() asset2;

  @Prop() depositId;

  dialog = false;

  transaction: API.Transaction | null = null;

  get meta() {
    const getAssetById = this.$store.getters[GlobalGetters.GET_ASSET_BY_ID];
    const liquidityAmount = this.transaction?.liquidity ?? 0;

    return {
      liquidityAmount,
      liquidityAsset: getAssetById(this.pair?.liquidity_asset_id ?? ""),
    };
  }

  show() {
    this.dialog = true;
    this.requestDepositOrder();
  }

  handleClose() {
    this.dialog = false;
  }

  async requestDepositOrder() {
    try {
      this.transaction = await this.$http.getMyTransaction({
        base: this.pair?.base_asset_id,
        quote: this.pair?.quote_asset_id,
        follow: this.depositId,
      });
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
  }
}
export default AddLiquiditySuccessModal;
</script>
