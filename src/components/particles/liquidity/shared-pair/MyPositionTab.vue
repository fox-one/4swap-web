<template>
  <div>
    <div class="subtitle-2 f-greyscale-3 mt-3">
      {{ $t("liquidity.my-position") }}
    </div>
    <base-asset-amount-item
      :asset="baseAsset"
      :amount="meta.sharedBaseAmount"
    />
    <base-asset-amount-item
      :asset="quoteAsset"
      :amount="meta.sharedQuoteAmount"
    />
    <div class="subtitle-2 f-greyscale-3 mt-3">
      {{ $t("liquidity.equivalent") }}
    </div>
    <v-layout class="pa-2">
      {{ meta.totalValueText }}
    </v-layout>
    <div class="subtitle-2 f-greyscale-3 mt-3">
      {{ $t("liquidity.percent") }}
    </div>
    <v-layout class="pa-2">
      {{ meta.percent }}
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IAsset, IPair } from "@/services/types/vo";

@Component
class MyPositionTab extends Vue {
  @Prop() baseAsset!: IAsset;

  @Prop() quoteAsset!: IAsset;

  @Prop() liquidityAsset;

  @Prop() pair!: IPair;

  get baseAmount() {
    return this.pair?.base_amount;
  }

  get quoteAmount() {
    return this.pair?.quote_amount;
  }

  get meta() {
    const balance = this.$store.getters["global/getBalanceByAssetId"](
      this.liquidityAsset?.id
    );
    const s = Number(balance ?? 0);
    const k = Number(this.pair?.liquidity ?? 0);

    const totalBaseAmount = Number(this.pair?.base_amount ?? 0);
    const totalQuoteAmount = Number(this.pair?.quote_amount ?? 0);
    let percent = k > 0 ? Math.min(s / k, 1) : 0;

    const sharedBaseAmount = totalBaseAmount * percent;
    const sharedQuoteAmount = totalQuoteAmount * percent;

    const totalValue =
      sharedBaseAmount * Number(this.baseAsset?.price ?? 0) +
      sharedQuoteAmount * Number(this.quoteAsset?.price ?? 0);
    const totalValueText = `$${totalValue.toFixed(2)}`;
    return {
      sharedBaseAmount,
      sharedQuoteAmount,
      percent: this.$utils.number.toPercent(percent, false),
      totalValueText,
    };
  }
}
export default MyPositionTab;
</script>
