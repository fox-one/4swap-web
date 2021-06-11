<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title>
        <v-icon size="20" color="primary" class="mr-2">
          {{ $icons.mdiCheckboxMarkedCircleOutline }}
        </v-icon>
        {{ $t("liquidity.remove.success") }}
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
        <v-btn text color="primary" @click="handleClose">
          {{ $t("ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class RemoveLiqSuccessModal extends Vue {
  transaction: API.Transaction | null = null;

  dialog = false;

  get meta() {
    const getAsset = this.$store.getters["global/getAssetById"];

    let base: any = null;
    const baseAsset = getAsset(this.transaction?.base_asset_id);
    if (baseAsset) {
      base = {
        symbol: baseAsset.symbol,
        icon: baseAsset.logo,
        amount: this.transaction?.base_amount,
      };
    }

    let quote: any = null;
    const quoteAsset = getAsset(this.transaction?.quote_asset_id);
    if (quoteAsset) {
      quote = {
        symbol: quoteAsset.symbol,
        icon: quoteAsset.logo,
        amount: this.transaction?.quote_amount,
      };
    }
    return {
      base,
      quote,
    };
  }

  show(transaction) {
    this.transaction = transaction;
    this.dialog = true;
  }

  handleClose() {
    this.dialog = false;
    this.$emit("ok");
  }
}
export default RemoveLiqSuccessModal;
</script>

<style lang="scss" scoped>
.liq-item {
  .icon {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
