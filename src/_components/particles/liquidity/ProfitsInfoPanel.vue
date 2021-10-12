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
        @click="onClickRefresh(ix)"
      />
    </f-info-grid>
  </f-panel>
</template>

<script lang="ts">
import { CreateElement } from "vue";
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { Getter, State } from "vuex-class";
import { VLayout } from "vuetify/lib";
import BigNumber from "bignumber.js";

const assetSwap = Vue.extend({
  props: {
    base: [String, Number, Object],
    quote: [String, Number, Object],
  },
  methods: {
    onRefresh() {
      this.$emit("onRefresh");
    },
  },
  render(h: CreateElement) {
    return h(
      VLayout,
      {
        props: {
          "justify-space-between": true,
        },
        staticClass: "align-center",
      },
      [
        h(
          "div",
          {
            staticClass: "mr-2",
          },
          [this.base, this.quote]
        ),
        h(
          "i",
          {
            staticClass: "d-flex align-center",
            on: {
              click: (this as any).onRefresh,
            },
          },
          [h("icon-refresh")]
        ),
      ]
    );
  },
});

@Component({
  components: {
    assetSwap,
  },
})
class ProfitsInfoPanel extends Vue {
  @Prop() pair!: API.Pair;

  @Prop() index!: number;

  @Prop({ type: Boolean, default: false }) expandDisabled!: boolean;

  @Prop() profits!: API.PairProfits | null;

  @State((state) => state.app.settings) settings;

  @PropSync("expandIndex") bindExpandIndex;

  @Getter("global/getAssetById") getAssetById;

  isShowDiff = false;

  isShowQuoteProfit = false;

  get meta() {
    const toFixed = this.$utils.number.toFixed;
    const formatWithSign = this.$utils.number.formatWithSign;
    const withSign = this.$utils.number.numWithSign;
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

    const sharedBaseAmount = +toFixed(totalBaseAmount * percent, 8);
    const sharedQuoteAmount = +toFixed(totalQuoteAmount * percent, 8);
    const totalValue =
      sharedBaseAmount * Number(baseAsset?.price ?? 0) +
      sharedQuoteAmount * Number(quoteAsset?.price ?? 0);
    const totalValueText = this.formatFiat(totalValue);

    const currBaseAmount = this.profits?.origin.currentBaseAmount;
    const currQuoteAmount = this.profits?.origin.currentQuoteAmount;
    const netBaseAmount = this.profits?.netBaseAmount;
    const netQuoteAmount = this.profits?.netQuoteAmount;
    const currBaseAmountOrigin = currBaseAmount;
    const currQuoteAmountOrigin = currQuoteAmount;
    const netBaseAmountOrigin = this.profits?.origin.netBaseAmount;
    const netQuoteAmountOrigin = this.profits?.origin.netQuoteAmount;
    const baseProfitOrigin = this.profits?.origin.baseProfit;
    const fiatProfitRateOrigin = this.profits?.origin.fiatProfitRate;
    const diffBaseAmountOrigin = new BigNumber(currBaseAmountOrigin!)
      .minus(netBaseAmountOrigin!)
      .toNumber();
    const diffQuoteAmountOrigin = new BigNumber(currQuoteAmountOrigin!)
      .minus(netQuoteAmountOrigin!)
      .toNumber();
    const diffBaseAmount = formatWithSign({
      n: diffBaseAmountOrigin,
      p: 8,
    });
    const diffQuoteAmount = formatWithSign({
      n: diffQuoteAmountOrigin,
      p: 8,
    });
    const baseProfit = this.profits?.baseProfit ?? 0;
    const baseProfitRate = this.profits?.baseProfitRate;
    const quoteProfit = this.profits?.quoteProfit ?? 0;
    const quoteProfitRate = this.profits?.quoteProfitRate;
    const quoteProfitRateValue = this.profits?.quoteProfitRateValue;
    const fiatProfit = this.profits?.origin.fiatProfit ?? 0;
    const fiatProfitRate = this.profits?.fiatProfitRate;
    const fiatProfitText = `${+fiatProfit < 0 ? "" : "+"}${this.formatFiat(
      fiatProfit
    )}`;

    return {
      hasLPAsset,
      baseAsset,
      quoteAsset,
      liquidityAsset,
      totalValueText,
      sharedBaseAmount,
      sharedQuoteAmount,
      currBaseAmount,
      currQuoteAmount,
      netBaseAmount,
      netQuoteAmount,
      diffBaseAmount,
      diffBaseAmountOrigin,
      diffQuoteAmount,
      diffQuoteAmountOrigin,
      baseProfit: withSign(baseProfit),
      baseProfitRate,
      quoteProfit: withSign(quoteProfit),
      quoteProfitRate,
      quoteProfitRateValue,
      percent: this.$utils.number.toPercent(percent, false),
      symbol: `${baseAsset?.symbol}-${quoteAsset?.symbol}`,
      baseSymbol: baseAsset?.symbol,
      quoteSymbol: quoteAsset?.symbol,
      fiatProfit,
      fiatProfitRate,
      fiatProfitText,
      fiatProfitRateOrigin,
      colorCoin: this.handleColor(+(baseProfitOrigin ?? 0)),
      colorUSD: this.handleColor(+(fiatProfitRateOrigin ?? 0)),
    };
  }

  handleColor(num: number) {
    const colorDown = this.$utils.color.colorDown(this);
    const colorUp = this.$utils.color.colorUp(this);
    return num < 0 ? colorDown : colorUp;
  }

  onClickRefresh(ind) {
    if (ind !== 0) return;
    this.isShowDiff = !this.isShowDiff;
  }

  handleBaseQuoteRefresh() {
    this.isShowQuoteProfit = !this.isShowQuoteProfit;
  }

  get pannelData() {
    const fiatCurrency = this.settings.currency;
    const colorUp = this.$utils.color.colorUp(this);
    const colorDown = this.$utils.color.colorDown(this);
    const h = this.$createElement;
    const meta = this.meta;

    return [
      {
        title: h(
          "div",
          {
            staticClass: "d-flex justify-center align-center",
          },
          [
            h("span", [
              this.$t(
                this.isShowDiff
                  ? "liquidity.profits.difference"
                  : "liquidity.profits.position"
              ) as string,
            ]),
            h(
              "span",
              {
                staticClass:
                  "d-flex justify-center align-center swap-form-tips_price-icon ml-2 mr-3",
                props: { size: 16, color: "primary" },
              },
              [h("icon-refresh")]
            ),
          ]
        ),
        value: h("div", [
          h("base-asset-with-symbol", {
            props: {
              amount: this.isShowDiff
                ? (+meta.diffBaseAmountOrigin > 0 ? "+" : "") +
                  this.$utils.number.format({
                    n: meta.diffBaseAmountOrigin,
                    p: 8,
                  })
                : this.$utils.number.format({
                    n: meta.currBaseAmount,
                    p: 8,
                  }),
              symbol: meta.baseSymbol,
              maxWidth: "45vw",
              color: this.isShowDiff
                ? +meta.diffBaseAmountOrigin > 0
                  ? colorUp
                  : colorDown
                : void 0,
            },
          }),
          h("base-asset-with-symbol", {
            props: {
              amount: this.isShowDiff
                ? (+meta.diffQuoteAmountOrigin > 0 ? "+" : "") +
                  this.$utils.number.format({
                    n: meta.diffQuoteAmountOrigin,
                    p: 8,
                  })
                : this.$utils.number.format({
                    n: meta.currQuoteAmount,
                    p: 8,
                  }),
              symbol: meta.quoteSymbol,
              maxWidth: "45vw",
              color: this.isShowDiff
                ? +meta.diffQuoteAmountOrigin > 0
                  ? colorUp
                  : colorDown
                : void 0,
            },
          }),
        ]),
        hint: !this.isShowDiff
          ? this.$t("liquidity.profits.tooltips.current")
          : "",
      },
      {
        title: this.$t("liquidity.profits.added"),
        value: h("div", [
          h("base-asset-with-symbol", {
            props: {
              amount: meta.netBaseAmount,
              symbol: meta.baseSymbol,
              maxWidth: "45vw",
            },
          }),
          h("base-asset-with-symbol", {
            props: {
              amount: meta.netQuoteAmount,
              symbol: meta.quoteSymbol,
              maxWidth: "45vw",
            },
          }),
        ]),
      },
      {
        title: this.$t("liquidity.profits.margin"),
        value: meta.quoteProfitRate,
        valueCustomColor:
          (meta.quoteProfitRateValue as number) > 0 ? colorUp : colorDown,
      },
      {
        title: this.$t("liquidity.profits.with.symbol", {
          symbol: this.isShowQuoteProfit ? meta.quoteSymbol : meta.baseSymbol,
        }),
        value: h("asset-swap", {
          props: {
            base: h("base-asset-with-symbol", {
              props: {
                amount: this.isShowQuoteProfit
                  ? meta.quoteProfit
                  : meta.baseProfit,
                symbol: this.isShowQuoteProfit
                  ? meta.quoteSymbol
                  : meta.baseSymbol,
                color: meta.colorCoin,
                maxWidth: "35vw",
              },
            }),
          },
          on: {
            onRefresh: this.handleBaseQuoteRefresh,
          },
        }),
        hint: this.$t("liquidity.profits.tooltips.profit"),
      },
      {
        title: this.$t("liquidity.profits.margin.with.symbol", {
          symbol: fiatCurrency,
        }),
        value: meta.fiatProfitRate,
        valueCustomColor:
          (meta.fiatProfitRateOrigin as number) > 0 ? colorUp : colorDown,
      },
      {
        title: this.$t("liquidity.profits.with.symbol", {
          symbol: fiatCurrency,
        }),
        value: meta.fiatProfitText,
        valueCustomColor: meta.fiatProfit > 0 ? colorUp : colorDown,
        hint: this.$t("liquidity.profits.tooltips.profit_fiat", {
          symbol: fiatCurrency,
        }),
      },
    ];
  }

  formatFiat(amountUsd, fraction = -1) {
    return this.$utils.number.formatFiat.call(this, this, amountUsd, fraction);
  }
}
export default ProfitsInfoPanel;
</script>
