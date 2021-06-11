<template>
  <f-info-grid :window-size="2">
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
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import bignumber from "bignumber.js";
import { Getter } from "vuex-class";

@Component
class SwapInfoPanel extends Vue {
  @Getter("global/getBalanceByAssetId") getBalanceByAssetId;

  @Getter("global/getPair") getPair;

  @Prop() inputAsset!: API.Asset | null;

  @Prop() outputAsset!: API.Asset | null;

  @Prop() inputAmount!: string;

  @Prop() outputAmount!: string;

  @Prop() preOrder!: API.SwapOrder | null;

  @Prop() preOrderError!: string | null;

  @Prop() impactValue!: number;

  @Prop() impact!: string;

  @Prop() pair!: API.Pair | null;

  priceDirection = 1;

  get meta() {
    const amount = Number(this.preOrder?.amount ?? 0);
    const amountSymbol = this.inputAsset?.symbol ?? "";
    const funds = Number(this.preOrder?.funds ?? 0);
    const fundsSymbol = this.outputAsset?.symbol ?? "";
    const getPrice = (funds, amount, fundsSymbol, amountSymbol) => {
      const v = amount / funds;
      const price = this.$utils.number.format({ n: v });
      return {
        amountSymbol,
        price,
        fundsSymbol,
        text: ` 1 ${amountSymbol} ≈ ${price} ${fundsSymbol}`,
      };
    };

    let price;
    if (amount !== 0 && funds !== 0) {
      price =
        this.priceDirection === 0
          ? getPrice(amount, funds, amountSymbol, fundsSymbol)
          : getPrice(funds, amount, fundsSymbol, amountSymbol);
    }

    let fee,
      feeP = 1;
    const route_assets = this.preOrder?.route_assets || [];

    route_assets.forEach((asset, ind) => {
      const pair = this.getPair({
        base: asset,
        quote: route_assets?.[ind + 1],
      });
      feeP *= 1 - (pair?.fee_percent ?? 0);
    });

    const len = (route_assets?.length ?? 0) - 1;
    if (len > 0) {
      const received = new bignumber(feeP).times(funds);
      fee = new bignumber(funds).minus(received).toNumber();
      fee = this.$utils.number.format({ n: fee, mp: 8 });
    }

    let minReceived;
    if (amount) {
      const slippage = Number(this.$store.state.app.settings.slippage) || 0.99;
      minReceived = new bignumber(amount).times(slippage).toString();
      minReceived = this.$utils.number.format({ n: minReceived, mp: 8 });
    }

    const balance = this.getBalanceByAssetId(this.inputAsset?.id);
    return {
      fee,
      minReceived,
      price,
      balance,
      symbol: this.inputAsset?.symbol,
      routes: this.preOrder?.route_assets,
      inputAssetSymbol: this.inputAsset?.symbol ?? "",
      outputAssetSymbol: this.outputAsset?.symbol ?? "",
    };
  }

  genRouteItem(assetId, index) {
    const h = this.$createElement;
    const isLast = index === (this.meta.routes && this.meta.routes?.length - 1);
    const assets = this.$store.state.global.assets;
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return null;
    return h("div", { staticClass: "swap-form-tips_route-item" }, [
      h("span", { staticStyle: { "font-size": "12px" } }, [
        asset.display_symbol || asset.symbol,
      ]),
      !isLast &&
        h("i", {
          staticClass: "icon-triangle",
        }),
    ]);
  }

  get impactStyle() {
    let textColor = "";
    let bgColor = "";

    const offset = Math.abs(this.impactValue * 100);
    if (offset >= 0 && offset <= 1) {
      textColor = "#A6EB70";
      bgColor = "rgba(166, 235, 112, 0.1)";
    } else if (offset > 1 && offset <= 10) {
      textColor = "#EBB270";
      bgColor = "rgba(235, 200, 112, 0.1)";
    } else if (offset > 10) {
      textColor = "#EB7086";
      bgColor = "rgba(235, 112, 134, 0.1)";
    }

    return { textColor, bgColor };
  }

  onClickRefresh(ind) {
    if (ind !== 0) return;
    this.priceDirection = (this.priceDirection + 1) % 2;
  }

  get pannelData() {
    const h = this.$createElement;
    const meta = this.meta;
    return [
      {
        title: h("div", [
          this.$t("tip.label.price") as string,
          meta.price &&
            h(
              "span",
              {
                staticClass: "swap-form-tips_price-icon ml-2",
                props: { size: 16, color: "primary" },
              },
              [h("icon-refresh")]
            ),
        ]),
        value: h(
          "div",
          { staticClass: "swap-form-tips_price" },
          meta.price
            ? [
                `1 `,
                h("span", { staticClass: "swap-form-tips_price-symbol" }, [
                  meta.price.amountSymbol,
                ]),
                ` ≈ ${meta.price.price} `,
                h("span", { staticClass: "swap-form-tips_price-symbol" }, [
                  meta.price.fundsSymbol,
                ]),
              ]
            : "-"
        ),
      },
      {
        title: this.$t("tip.label.min-recevied"),
        value: this.meta.minReceived ?? "-",
        valueUnit: this.meta.minReceived ? this.meta.outputAssetSymbol : "",
      },
      {
        title: this.$t("tip.label.fee"),
        value: this.meta.fee ?? "-",
        valueUnit: this.meta.fee ? this.meta.inputAssetSymbol : "",
      },
      {
        title: this.$t("swap.price.impact"),
        value: this.impact ?? "-",
        valueCustomColor: this.impactStyle.textColor,
      },
    ];
  }

  get perOrderError() {
    if (this.preOrderError) {
      return this.$t(this.preOrderError);
    }
    return null;
  }
}
export default SwapInfoPanel;
</script>

<style lang="scss" scoped>
::v-deep {
  .swap-form-tips_price {
    word-break: break-word;
    font-size: 14px;
    font-weight: 600;

    &-symbol {
      font-size: 12px;
    }

    &-icon {
      display: inline-block;
      vertical-align: middle;
    }
  }

  .swap-form-tips_routes {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .swap-form-tips_route-item {
      display: flex;
      align-items: center;
      font-weight: 500;

      &__image {
        height: 18px;
        width: 18px;
        margin-right: 4px;
      }
    }
  }

  .f-form-tips__text {
    padding: 6px 0 !important;
  }

  .icon-triangle {
    display: inline-block;
    margin: 0 4px 1px 4px;
    width: 0;
    height: 0;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-top-left-radius: 1px;
    border-bottom-left-radius: 1px;
    border-left: 5px solid rgba($color: #000000, $alpha: 0.6);
  }
}
</style>
