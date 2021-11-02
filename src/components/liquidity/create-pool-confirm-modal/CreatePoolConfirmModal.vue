<template>
  <v-dialog v-model="dialog" max-width="450">
    <f-panel class="pa-8">
      <div class="label-1 text-center">
        {{ $t("liquidity.create.new-pool") }}
      </div>

      <div class="symbol mt-6">
        <base-pair-icon :base-asset="asset1" :quote-asset="asset2" />
        <span class="ml-3">{{ meta.symbol }}</span>
      </div>

      <div class="mt-6 fee">You need to pay fee: {{ meta.feeText }}</div>

      <v-layout justify-space-around class="mt-6">
        <f-button text color="greyscale_3" @click="handleCancel">
          {{ $t("cancel") }}
        </f-button>
        <f-button text @click="handleCreate">
          {{ $t("create") }}
        </f-button>
      </v-layout>
    </f-panel>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { CREATE_FEE } from "@/constants";
import { GlobalGetters } from "@/store/types";

@Component
class CreatePoolConfirmModal extends Vue {
  @Prop() asset1;

  @Prop() asset2;

  dialog = false;

  get meta() {
    const getAssetById = this.$store.getters[GlobalGetters.GET_ASSET_BY_ID];
    const symbol = `${this.asset1?.symbol ?? ""} / ${
      this.asset2?.symbol ?? ""
    }`;
    const asset = getAssetById(CREATE_FEE.asset_id);
    const feeText = `${CREATE_FEE.amount} ${asset.symbol}`;

    return { symbol, feeText };
  }

  show() {
    this.dialog = true;
  }

  handleCancel() {
    this.dialog = false;
  }

  handleCreate() {
    this.dialog = false;
    this.$emit("confirm");
  }
}
export default CreatePoolConfirmModal;
</script>

<style lang="scss" scoped>
.symbol {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
}

.fee {
  background-color: var(--v-warning_bg-base);
  color: var(--v-warning-base);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  font-weight: 500;
}
</style>
