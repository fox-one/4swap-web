<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title>
        <v-icon size="20" color="primary" class="mr-2">
          {{ $icons.mdiCheckboxMarkedCircleOutline }}
        </v-icon>
        {{ $t("liquidity.add.success") }}
      </v-card-title>
      <v-card-text class="pb-0">
        <div v-if="meta.base" class="liq-item my-1">
          <v-img
            :src="meta.base.icon"
            width="20"
            height="20"
            class="icon mr-1"
          />
          <span>{{ meta.base.amount }}</span>
          <span>{{ meta.base.symbol }}</span>
        </div>
        <div v-if="meta.quote" class="liq-item my-1">
          <v-img
            :src="meta.quote.icon"
            width="20"
            height="20"
            class="icon mr-1"
          />
          <span>{{ meta.quote.amount }}</span>
          <span>{{ meta.quote.symbol }}</span>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <f-button text color="primary" @click="handleClose">
          {{ $t("ok") }}
        </f-button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Vue } from "vue-property-decorator";

@Component
class AddLiqSuccessModal extends Vue {
  order: API.DepositOrder | null = null;

  dialog = false;

  get meta() {
    const getAsset = this.$store.getters["global/getAssetById"];
    const baseAsset = getAsset(this.order?.base_asset_id);
    const quoteAsset = getAsset(this.order?.quote_asset_id);

    return {
      base: {
        amount: "+" + this.order?.base_amount,
        symbol: baseAsset?.symbol,
        icon: baseAsset?.logo,
        id: baseAsset?.id,
      },
      quote: {
        amount: "+" + this.order?.quote_amount,
        symbol: quoteAsset?.symbol,
        icon: quoteAsset?.logo,
        id: quoteAsset?.id,
      },
    };
  }

  show(order) {
    this.order = order;
    this.dialog = true;
  }

  handleClose() {
    this.dialog = false;
    this.$emit("ok");
  }
}
export default AddLiqSuccessModal;
</script>

<style lang="scss" scoped>
.liq-item {
  .icon {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
