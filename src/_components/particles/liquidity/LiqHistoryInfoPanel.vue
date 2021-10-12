<template>
  <f-panel class="pa-0 pt-4 no-border-radius">
    <div class="text-center f-greyscale-3 f-caption">
      {{ $t("me.total.balance") }}
    </div>
    <div class="text-center f-headline mt-2">
      {{ meta.totalValueText }}
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
  </f-panel>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component
class LiqHistoryInfoPanel extends Vue {
  @Prop() pair!: API.Pair;

  @Prop() index!: number;

  @Prop({ type: Boolean, default: false }) expandDisabled!: boolean;

  @Prop({ type: Boolean, default: false }) showActions!: boolean;

  @Prop() profits!: API.PairProfits | null;

  @PropSync("expandIndex") bindExpandIndex;

  @Getter("global/getAssetById") getAssetById;

  isReverseAddedPrice = false;

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
    const sharedBaseRate = sharedBaseAmount / sharedQuoteAmount;
    const sharedQuoteRate = 1 / sharedBaseRate;

    const totalValue =
      sharedBaseAmount * Number(baseAsset?.price ?? 0) +
      sharedQuoteAmount * Number(quoteAsset?.price ?? 0);
    const totalValueText = this.formatFiat(totalValue);

    const currBaseAmount = this.profits?.currentBaseAmount;
    const currQuoteAmount = this.profits?.currentQuoteAmount;
    const currBaseRate =
      (this.profits?.origin.currentBaseAmount as number) /
      (this.profits?.origin?.currentQuoteAmount as number);
    const currQuoteRate = 1 / currBaseRate;

    const netBaseAmount = this.profits?.netBaseAmount;
    const netQuoteAmount = this.profits?.netQuoteAmount;
    const netBaseRate =
      (this.profits?.origin?.netBaseAmount as number) /
      (this.profits?.origin?.netQuoteAmount as number);
    const netQuoteRate = 1 / netBaseRate;

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
      sharedBaseRate,
      sharedQuoteRate,

      currBaseAmount,
      currQuoteAmount,
      currBaseRate,
      currQuoteRate,

      netBaseAmount,
      netQuoteAmount,
      netBaseRate,
      netQuoteRate,

      baseProfit,
      baseProfitRate,
      quoteProfit,
      quoteProfitRate,
      percent: this.$utils.number.toPercent(percent, false),
      symbol: `${baseAsset?.symbol}-${quoteAsset?.symbol}`,
      baseSymbol: baseAsset?.symbol,
      quoteSymbol: quoteAsset?.symbol,
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
    const h = this.$createElement;
    const meta = this.meta;

    return [
      {
        title: this.$t("liquidity.profits.position"),
        value: h("div", [
          h("base-asset-with-symbol", {
            props: {
              amount: meta.currBaseAmount,
              symbol: meta.baseSymbol,
              maxWidth: "35vw",
            },
          }),
          h("base-asset-with-symbol", {
            props: {
              amount: meta.currQuoteAmount,
              symbol: meta.quoteSymbol,
              maxWidth: "35vw",
            },
          }),
        ]),
      },
      {
        title: this.$t("liquidity.profits.wallet_position"),
        value: h("div", [
          h("base-asset-with-symbol", {
            props: {
              amount: this.$utils.number.format({
                n: meta.sharedBaseAmount,
                p: 8,
              }),
              symbol: meta.baseSymbol,
              maxWidth: "35vw",
            },
          }),
          h("base-asset-with-symbol", {
            props: {
              amount: this.$utils.number.format({
                n: meta.sharedQuoteAmount,
                p: 8,
              }),
              symbol: meta.quoteSymbol,
              maxWidth: "35vw",
            },
          }),
        ]),
      },
      {
        title: this.$t("liquidity.profits.added"),
        value: h("div", [
          h("base-asset-with-symbol", {
            props: {
              amount: meta.netBaseAmount,
              symbol: meta.baseSymbol,
              maxWidth: "35vw",
            },
          }),
          h("base-asset-with-symbol", {
            props: {
              amount: meta.netQuoteAmount,
              symbol: meta.quoteSymbol,
              maxWidth: "35vw",
            },
          }),
        ]),
      },
      {
        title: this.$t("liquidity.percent.abbr"),
        value: meta.percent,
      },
      {
        title: this.$t("liquidity.profits.position.price") as string,
        value: h(
          "div",
          { staticClass: "swap-form-tips_price" },
          meta.currQuoteRate && meta.currBaseRate
            ? [
                h("base-asset-price", {
                  props: {
                    baseSymbol: meta.baseSymbol,
                    amount: meta.currQuoteRate,
                    symbol: meta.quoteSymbol,
                  },
                }),
                h("base-asset-price", {
                  props: {
                    baseSymbol: meta.quoteSymbol,
                    amount: meta.currBaseRate,
                    symbol: meta.baseSymbol,
                  },
                }),
              ]
            : "-"
        ),
      },
      {
        title: this.$t("liquidity.profits.added.price") as string,
        value: h(
          "div",
          { staticClass: "swap-form-tips_price" },
          meta.netBaseRate && meta.netQuoteRate
            ? [
                h("base-asset-price", {
                  props: {
                    baseSymbol: meta.baseSymbol,
                    amount: meta.netQuoteRate,
                    symbol: meta.quoteSymbol,
                  },
                }),
                h("base-asset-price", {
                  props: {
                    baseSymbol: meta.quoteSymbol,
                    amount: meta.netBaseRate,
                    symbol: meta.baseSymbol,
                  },
                }),
              ]
            : "-"
        ),
      },
    ];
  }
  formatFiat(amountUsd, fraction = -1) {
    return this.$utils.number.formatFiat.call(this, this, amountUsd, fraction);
  }
}
export default LiqHistoryInfoPanel;
</script>
