<template>
  <v-dialog v-model="dialog" max-width="450">
    <f-panel class="pa-8">
      <div class="label-1 d-flex align-center justify-center">
        <v-icon class="mr-1"> $IconCheck </v-icon>

        {{ $t("liquidity.remove.success") }}
      </div>

      <div class="mt-6">
        <base-modal-asset-item
          v-if="transaction"
          is-input
          :asset="meta.liquidityAsset"
          :amount="meta.liquidityAmount"
        />
        <base-modal-asset-item
          :asset="meta.baseAsset"
          :amount="meta.baseAmount"
        />
        <base-modal-asset-item
          :asset="meta.quoteAsset"
          :amount="meta.quoteAmount"
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
class RemoveLiquiditySuccessModal extends Vue {
  @Prop() pair;

  dialog = false;

  transaction: API.Transaction | null = null;

  get meta() {
    const getAssetById = this.$store.getters[GlobalGetters.GET_ASSET_BY_ID];
    const liquidityAmount = this.transaction?.liquidity ?? 0;
    const baseAmount = this.transaction?.base_amount ?? 0;
    const quoteAmount = this.transaction?.quote_amount ?? 0;

    return {
      baseAmount,
      quoteAmount,
      liquidityAmount,
      baseAsset: getAssetById(this.pair?.base_asset_id ?? ""),
      quoteAsset: getAssetById(this.pair?.quote_asset_id ?? ""),
      liquidityAsset: getAssetById(this.pair?.liquidity_asset_id ?? ""),
    };
  }

  show(follow) {
    this.dialog = true;
    this.requestDepositOrder(follow);
  }

  handleClose() {
    this.dialog = false;
  }

  async requestDepositOrder(follow) {
    try {
      this.transaction = await this.$http.getMyTransaction({
        base: this.pair?.base_asset_id,
        quote: this.pair?.quote_asset_id,
        follow,
      });
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
  }
}
export default RemoveLiquiditySuccessModal;
</script>
