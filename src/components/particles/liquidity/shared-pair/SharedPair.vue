<template>
  <f-panel class="mb-3 pa-0">
    <div align-center @click="handleExpand" class="pt-4">
      <div class="pl-4">
        <base-pair-icon-with-symbol
          :base-asset="meta.baseAsset"
          :quote-asset="meta.quoteAsset"
          small
        />
      </div>
      <f-info-grid class="pa-0 mt-4" :window-size="2">
        <f-info-grid-item
          v-for="(item, ix) in pannelData"
          :key="ix"
          :index="ix"
          :title="item.title"
          :value="item.value"
          :value-unit="item.valueUnit"
          :value-custom-color="item.valueCustomColor"
          :hint="item.hint"
        />
      </f-info-grid>
    </div>

    <v-expand-transition>
      <div v-if="bindExpandIndex === index">
        <div class="pa-3 pt-0">
          <div v-if="profits" class="caption f-greyscale-3 mb-3">
            {{ $t("liquidity.history.label.calc") }}
          </div>
          <template v-if="profits">
            <div class="caption f-greyscale-3 mt-1">
              {{ $t("liquidity.history.label.net") }}
            </div>
            <pair-liquidity
              class="py-1"
              :base-asset="meta.baseAsset"
              :base-amount="meta.netBaseAmount"
              :quote-asset="meta.quoteAsset"
              :quote-amount="meta.netQuoteAmount"
            />
            <pair-profit
              v-if="profits"
              :profits="profits"
              :base-asset="meta.baseAsset"
              :quote-asset="meta.quoteAsset"
              class="py-1"
            />
            <pair-fiat-profit v-if="profits" :profits="profits" class="py-1" />
          </template>
        </div>
        <actions
          v-show="showActions"
          :base-asset="meta.baseAsset"
          :quote-asset="meta.quoteAsset"
        />
      </div>
    </v-expand-transition>
  </f-panel>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { Getter } from "vuex-class";
import Actions from "./Actions.vue";
import PairLiquidity from "./PairLiquidity.vue";
import PairProfit from "./PairProfit.vue";
import PairFiatProfit from "./PairFiatProfit.vue";

@Component({
  components: {
    Actions,
    PairLiquidity,
    PairProfit,
    PairFiatProfit,
  },
})
class LiquiditySharedPair extends Vue {
  @Prop() pair!: API.Pair;

  @Prop() index!: number;

  @Prop({ type: Boolean, default: false }) expandDisabled!: boolean;

  @Prop({ type: Boolean, default: false }) showActions!: boolean;

  @Prop() profits!: API.PairProfits | null;

  @PropSync("expandIndex") bindExpandIndex;

  @Getter("global/getAssetById") getAssetById;

  get meta() {
    const baseAsset = this.getAssetById(this.pair.base_asset_id);
    const quoteAsset = this.getAssetById(this.pair.quote_asset_id);
    const liquidityAsset = this.getAssetById(this.pair.liquidity_asset_id);
    const balance = this.$store.getters["global/getBalanceByAssetId"](
      this.pair.liquidity_asset_id
    );
    const hasLPAsset = this.pair.liquidity_asset_id;
    const s = liquidityAsset
      ? Number(balance ?? 0)
      : Number(this.pair?.share ?? 0);
    const k = Number(this.pair?.liquidity ?? 0);

    const totalBaseAmount = Number(this.pair?.base_amount ?? 0);
    const totalQuoteAmount = Number(this.pair?.quote_amount ?? 0);
    const percent = k > 0 ? Math.min(s / k, 1) : 0;

    const sharedBaseAmount = totalBaseAmount * percent;
    const sharedQuoteAmount = totalQuoteAmount * percent;
    const totalValue =
      sharedBaseAmount * Number(baseAsset?.price ?? 0) +
      sharedQuoteAmount * Number(quoteAsset?.price ?? 0);
    const totalValueText = this.formatFiat(totalValue);

    const netBaseAmount = this.profits?.netBaseAmount;
    const netQuoteAmount = this.profits?.netQuoteAmount;
    const baseProfit = this.profits?.baseProfit;
    const baseProfitRate = this.profits?.baseProfitRate;
    const quoteProfit = this.profits?.quoteProfit;
    const quoteProfitRate = this.profits?.quoteProfitRate;

    return {
      hasLPAsset,
      baseAsset,
      quoteAsset,
      liquidityAsset,
      totalValueText,
      sharedBaseAmount,
      sharedQuoteAmount,
      netBaseAmount,
      netQuoteAmount,
      baseProfit,
      baseProfitRate,
      quoteProfit,
      quoteProfitRate,
      percent: this.$utils.number.toPercent(percent, false),
      symbol: `${baseAsset?.symbol}-${quoteAsset?.symbol}`,
    };
  }

  handleExpand() {
    if (this.expandDisabled) return;
    if (this.bindExpandIndex === this.index) {
      this.bindExpandIndex = -1;
      return;
    }
    this.bindExpandIndex = this.index;
  }

  get pannelData() {
    return [
      {
        title: this.$t("balance.abbr"),
        value: this.meta.totalValueText,
      },
      {
        title: this.$t("liquidity.percent.abbr"),
        value: this.meta.percent,
      },
      {
        title: this.meta.baseAsset.symbol,
        value: this.$utils.number.toFixed(this.meta.sharedBaseAmount, 8),
      },
      {
        title: this.meta.quoteAsset.symbol,
        value: this.$utils.number.toFixed(this.meta.sharedQuoteAmount, 8),
      },
    ];
  }

  formatFiat(amountUsd, fraction = -1) {
    return this.$utils.number.formatFiat.call(this, this, amountUsd, fraction);
  }
}
export default LiquiditySharedPair;
</script>
