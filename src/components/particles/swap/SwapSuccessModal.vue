<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title>
        <v-icon size="20" color="primary" class="mr-2">
          {{ $icons.mdiCheckboxMarkedCircleOutline }}
        </v-icon>
        {{ $t("swap.success") }}
      </v-card-title>
      <v-card-text class="pb-0">
        <div class="summary f-body-2 mb-2">
          <v-img width="20" height="20" class="icon" :src="meta.payAssetIcon" />
          <span>
            {{ meta.payAmountText }}
          </span>
          <v-icon size="16" class="mx-2">
            {{ $icons.mdiArrowRight }}
          </v-icon>
          <span class="mr-1">
            <v-img
              width="20"
              height="20"
              class="icon"
              :src="meta.fillAssetIcon"
            />
          </span>
          <span>
            {{ meta.fillAmountText }}
          </span>
        </div>
        <div class="f-body-2 my-1">
          <span> 1 {{ meta.payAssetSymbol }} </span>
          <span> / </span>
          <span> {{ meta.price }} {{ meta.fillAssetSymbol }} </span>
        </div>
        <div class="f-body-2 my-1">
          <span> 1 {{ meta.fillAssetSymbol }} </span>
          <span> / </span>
          <span> {{ meta.priceRevert }} {{ meta.payAssetSymbol }} </span>
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
class SwapSuccessModal extends Vue {
  order: API.SwapOrder | null = null;

  dialog = false;

  get meta() {
    const getAsset = this.$store.getters["global/getAssetById"];
    const formatNumber = this.$utils.number.format;
    const payAsset = getAsset(this.order?.pay_asset_id);
    const fillAsset = getAsset(this.order?.fill_asset_id);
    const payAmount = this.$utils.number.format({
      n: this.order?.pay_amount ?? "",
      p: 8,
    });
    const fillAmount = this.$utils.number.format({
      n: this.order?.fill_amount ?? "",
      p: 8,
    });
    const payAssetSymbol = payAsset?.symbol ?? "";
    const fillAssetSymbol = fillAsset?.symbol ?? "";
    const payAmountText = `${payAmount} ${payAssetSymbol}`;
    const fillAmountText = `${fillAmount} ${fillAssetSymbol}`;
    let priceRevert = "";
    let price = "";
    if (this.order) {
      priceRevert = formatNumber({
        n: +this.order?.pay_amount / +this.order?.fill_amount,
      });
      price = formatNumber({
        n: +this.order?.fill_amount / +this.order?.pay_amount,
      });
    }

    return {
      payAsset,
      fillAsset,
      payAssetSymbol,
      fillAssetSymbol,
      payAmountText,
      fillAmountText,
      priceRevert,
      price,
      payAssetIcon: payAsset?.logo,
      fillAssetIcon: fillAsset?.logo,
    };
  }

  show(order) {
    this.order = order;
    this.dialog = true;
  }

  handleClose() {
    this.dialog = false;
  }
}
export default SwapSuccessModal;
</script>

<style lang="scss" scoped>
.summary {
  word-break: break-word;
  line-height: 24px;

  .icon {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
