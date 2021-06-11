<template>
  <div>
    <f-panel
      class="no-border-radius pair-info__detail pa-0 pt-3"
      style="overflow: hidden; max-width: 100vw"
    >
      <div class="f-greyscale-3 f-caption pair-info__pricehint">
        {{ $t("price") }}
      </div>
      <v-layout align-baseline justify-center>
        <div class="my-2 f-headline">
          <price-text :price="isReverse ? reversePriceText : priceText" />
        </div>
        <i @click="flipPrice" style="margin-left: 10px">
          <icon-refresh />
        </i>
      </v-layout>
      <div class="f-greyscale-3 f-caption pair-info__pricehint">
        {{ isReverse ? fiatPriceRev : fiatPrice }}
      </div>

      <f-info-grid :window-size="3">
        <f-info-grid-item
          v-for="(item, ix) in pannelData"
          :key="ix"
          :index="ix"
          :title="item.title"
          :value="item.value"
          :value-unit="item.valueUnit"
          :value-custom-color="item.valueCustomColor"
          :hint="item.hint"
          @click="onClickSwitchROR(ix)"
        />
      </f-info-grid>
    </f-panel>

    <div class="pair-info__assets px-4 mt-4">
      <div class="f-title-1 f-greyscale-1 mb-4">
        {{ $t("pool.added-assets") }}
      </div>
      <f-panel class="pair-info__assets_block pa-4">
        <v-layout align-center justify-space-between>
          <div @click="goCoinStatistic(baseAsset.id)">
            <base-pool-slat-narrow-item
              :show-display-symbol="meta.isSameSymbol"
              :asset="baseAsset"
              :amount="meta.baseAmount"
              class="pair-asset"
            >
              <template #suffix>
                <base-asset-promote :asset="baseAsset" />
              </template>
            </base-pool-slat-narrow-item>
          </div>
          <div @click="goCoinStatistic(quoteAsset.id)">
            <base-pool-slat-narrow-item
              :show-display-symbol="meta.isSameSymbol"
              :asset="quoteAsset"
              :amount="meta.quoteAmount"
              class="pair-asset"
            >
              <template #suffix>
                <base-asset-promote :asset="quoteAsset" />
              </template>
            </base-pool-slat-narrow-item>
          </div>
        </v-layout>
      </f-panel>
    </div>
  </div>
</template>

<script lang="ts">
import { CreateElement } from "vue";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { State } from "vuex-class";
import BigNumber from "bignumber.js";

const priceText = Vue.extend({
  props: {
    price: Object,
  },

  render(h: CreateElement) {
    return h(
      "div",
      { staticClass: "f-headline", staticStyle: { height: "30px" } },
      [
        `1 `,
        h("span", { staticClass: "f-body-2" }, [this.price.symbol_base]),
        ` ≈ ${this.price.num} `,
        h("span", { staticClass: "f-body-2" }, [this.price.symbol_quote]),
      ]
    );
  },
});

@Component({
  components: {
    priceText,
  },
})
class BaseInfoPanel extends Vue {
  @Prop() pair!: API.Pair;

  @Prop() baseAsset!: API.Asset;

  @Prop() quoteAsset!: API.Asset;

  @State((state) => state.app.settings) settings;

  priceText = {};

  reversePriceText = {};

  fiatPrice = "";

  fiatPriceRev;

  isReverse = false;

  rorInd = 0;

  get pannelData() {
    const currencySymbol = this.settings.currency;
    const h = this.$createElement;
    const colorUp = this.$utils.color.colorUp(this);
    const colorDown = this.$utils.color.colorDown(this);
    const recentRorTitles = [
      this.$t("recent_ror.24hours"),
      this.$t("recent_ror.7days"),
      this.$t("recent_ror.30days"),
    ];
    return [
      {
        title: this.$t("liquidity.fiat", { symbol: currencySymbol }),
        value: "" + this.meta.totalValueText,
      },
      {
        title: this.$t("volume.24hours"),
        value: "" + this.meta.volumeText,
      },
      {
        title: this.$t("trades.24hours"),
        value: "" + this.meta.transactionCount,
      },
      {
        title: this.$t("fees.24hours"),
        value: "" + this.meta.feeText,
      },
      {
        title: this.$t("pool_turnover.24hours"),
        value: "" + this.meta.poolTurnoverText,
        hint: this.$t("pool_turnover.tooltip"),
      },
      {
        title: h(
          "div",
          {
            staticClass: "d-flex justify-center align-center",
          },
          [
            h("span", [recentRorTitles[this.rorInd] as string]),
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
        value:
          "" +
          this.$utils.number.toPercent(
            this.meta.recentROR.netRors[this.rorInd],
            true,
            4
          ),
        valueCustomColor:
          this.meta.recentROR.netRors[this.rorInd] > 0 ? colorUp : colorDown,
        hint: this.$t("recent_ror.tooltip"),
      },
    ];
  }

  get meta() {
    const hasLPAsset = this.pair?.liquidity_asset_id;
    let baseSymbol = this.baseAsset?.symbol;
    let quoteSymbol = this.quoteAsset?.symbol;
    const baseAmount = Number(this.pair?.base_amount ?? 0);
    const quoteAmount = Number(this.pair?.quote_amount ?? 0);
    const symbol = `${baseSymbol}-${quoteSymbol}`;
    const isSameSymbol = this.baseAsset && baseSymbol === quoteSymbol;
    if (isSameSymbol) {
      baseSymbol = this.baseAsset?.display_symbol;
      quoteSymbol = this.quoteAsset?.display_symbol;
    }

    const totalValueUSD = new BigNumber(this.pair?.base_value ?? 0).plus(
      this.pair?.quote_value ?? 0
    );

    const poolTurnover = new BigNumber(this.pair.volume_24h)
      .div(totalValueUSD)
      .multipliedBy(100);

    const totalValueText = this.formatFiat(totalValueUSD);
    const volumeText = this.formatFiat(this.pair.volume_24h);
    const feeText = this.formatFiat(this.pair.fee_24h);
    const transactionCount = this.pair.transaction_count_24h ?? 0;
    const poolTurnoverText = `${
      poolTurnover.isNaN() ? 0 : poolTurnover.toFixed(2)
    }%${this.turnoverIcons(poolTurnover)}`;

    const feePercent = Number(this.pair?.fee_percent ?? 0);

    const periodData = this.$store.getters["global/getPeriodData"];
    const recentROR = this.calculateRorAndImpLoss(periodData, feePercent);
    return {
      isSameSymbol,
      baseAmount,
      quoteAmount,
      hasLPAsset,
      totalValueText,
      volumeText,
      feeText,
      symbol,
      transactionCount,
      poolTurnoverText,
      recentROR,
    };
  }

  @Watch("pair", { immediate: true })
  handleOrderChange() {
    this.setPriceText();
  }

  onClickSwitchROR(ind) {
    if (ind !== 5) return;
    this.rorInd++;
    if (this.rorInd === 3) {
      this.rorInd = 0;
    }
  }

  calculateRorAndImpLoss(data, fee) {
    const totalLiq = new BigNumber(this.pair?.base_value ?? 0)
      .plus(this.pair?.quote_value ?? 0)
      .toNumber();
    const losses = data?.priceRatios?.map((x) => {
      const ret = (2 * Math.sqrt(x)) / (1 + x) - 1;
      return ret;
    });
    const margins = data?.volSums?.map((x) => {
      const ret = (fee * x) / totalLiq;
      return ret;
    });
    const netRors: Array<number> = [];
    margins?.forEach((x, ix) => {
      netRors.push(x + losses[ix]);
    });
    return { losses, margins, netRors };
  }

  turnoverIcons(poolTurnover) {
    const p = parseInt(poolTurnover);
    if (p > 90) {
      return "🔥🔥🔥";
    } else if (p > 60) {
      return "🔥🔥";
    } else if (p > 30) {
      return "🔥";
    }
    return "";
  }

  async setPriceText() {
    const formatNumber = (v) => this.$utils.number.format(v);
    const baseAmount = Number(this.pair?.base_amount ?? 0);
    const quoteAmount = Number(this.pair?.quote_amount ?? 0);
    const basePrice = Number(this.baseAsset?.price ?? 0);
    const quotePrice = Number(this.quoteAsset?.price ?? 0);
    let baseSymbol = this.baseAsset?.symbol;
    let quoteSymbol = this.quoteAsset?.symbol;
    const getPrice = (funds, amount, fundsSymbol, amountSymbol) => {
      const p = funds / amount;
      const price = formatNumber({ n: p });
      return {
        symbol_base: amountSymbol,
        symbol_quote: fundsSymbol,
        num: price,
      };
    };

    const getUSDPrice = (funds, amount, fundsPrice) => {
      const p = funds / amount;
      const fiatPrice = p * fundsPrice;
      return fiatPrice;
    };

    const getCurvePrice = async (
      inputAsset,
      outputAsset,
      fundsSymbol,
      amountSymbol
    ) => {
      const preOrder = await this.$pairRoutes.getPreOrder({
        inputAsset,
        outputAsset,
        inputAmount: "0.0001", // use small amount, because BTC-WBTC
      });
      const p = preOrder.amount / preOrder.funds;
      const price = formatNumber({ n: p });
      return {
        symbol_base: fundsSymbol,
        symbol_quote: amountSymbol,
        num: price,
      };
    };

    const getUSDCurvePrice = async (inputAsset, outputAsset, fundsPrice) => {
      const preOrder = await this.$pairRoutes.getPreOrder({
        inputAsset,
        outputAsset,
        inputAmount: "0.0001", // use small amount, because BTC-WBTC
      });
      const p = preOrder.amount / preOrder.funds;
      const fiatPrice = p * fundsPrice;
      return fiatPrice;
    };

    if (this.pair.swap_method === "curve") {
      this.priceText = await getCurvePrice(
        this.baseAsset.id,
        this.quoteAsset.id,
        baseSymbol,
        quoteSymbol
      );
      const usdPrice = await getUSDCurvePrice(
        this.baseAsset.id,
        this.quoteAsset.id,
        quotePrice
      );
      this.reversePriceText = await getCurvePrice(
        this.quoteAsset.id,
        this.baseAsset.id,
        quoteSymbol,
        baseSymbol
      );
      const usdPriceRev = await getUSDCurvePrice(
        this.quoteAsset.id,
        this.baseAsset.id,
        basePrice
      );
      this.fiatPrice = this.formatFiat(usdPrice);
      this.fiatPriceRev = this.formatFiat(usdPriceRev);
      return;
    }

    if (baseAmount !== 0 && quoteAmount !== 0) {
      this.priceText = getPrice(
        baseAmount,
        quoteAmount,
        baseSymbol,
        quoteSymbol
      );
      const usdPrice = await getUSDPrice(baseAmount, quoteAmount, basePrice);
      this.reversePriceText = getPrice(
        quoteAmount,
        baseAmount,
        quoteSymbol,
        baseSymbol
      );
      const usdPriceRev = await getUSDPrice(
        quoteAmount,
        baseAmount,
        quotePrice
      );
      this.fiatPrice = this.formatFiat(usdPrice);
      this.fiatPriceRev = this.formatFiat(usdPriceRev);
    }
  }

  flipPrice() {
    this.isReverse = !this.isReverse;
  }

  goCoinStatistic(id: string) {
    this.$router.push({
      name: "statistic-coin",
      query: {
        id,
      },
    });
  }

  formatFiat(amountUsd, fraction = -1) {
    return this.$utils.number.formatFiat.call(this, this, amountUsd, fraction);
  }
}
export default BaseInfoPanel;
</script>

<style lang="scss" scoped>
.pair-info__detail {
  .pair-info__pricehint {
    text-align: center;
  }
}

.pair-info__assets {
  &_block {
    height: 87px;
    border-radius: 10px;
  }
}
</style>
