<template>
  <f-form-tips
    :tips="tips"
    :max="8"
    :balance="meta.balance"
    :symbol="meta.symbol"
    :price="meta.price"
    :routes="meta.routes"
    class="swap-form-tips"
    v-on="$listeners"
    @switch:price="handleSwitchPrice"
  >
    <template #action>
      <div class="pl-2">
        <f-button
          outlined
          rounded
          fab
          width="18"
          height="18"
          color="primary"
          class="text-center"
          @click="$emit('switch')"
        >
          <v-icon size="16">
            {{ $icons.mdiUnfoldMoreHorizontal }}
          </v-icon>
        </f-button>
      </div>
    </template>
  </f-form-tips>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { CreateElement, VNode } from "vue";
import bignumber from "bignumber.js";
import { VIcon } from "vuetify/lib";
import { Getter } from "vuex-class";

const PriceInfo = Vue.extend({
  props: { price: { type: String, default: "" } },
  render(h: CreateElement): VNode {
    if (!this.price) {
      return h("div", [this.$t("tip.label.price") + "-"]);
    }
    return h("div", { staticClass: "swap-form-tips_price" }, [
      this.$t("tip.label.price") + this.price,
      this.price &&
        h(
          VIcon,
          {
            staticClass: "ml-1",
            props: { size: 18, color: "primary" },
            on: { click: () => this.$emit("switch:price") },
          },
          [this.$icons.mdiSwapHorizontal]
        ),
    ]);
  },
});

const SwapRoutes = Vue.extend({
  props: { routes: { type: Array, default: () => [] } },
  render(h: CreateElement) {
    const genRouteItem = (assetId, index) => {
      const isLast = index === this.routes.length - 1;
      const assets = this.$store.state.global.assets;
      const asset = assets.find((a) => a.id === assetId);
      if (!asset) return null;
      return h("div", { staticClass: "swap-form-tips_route-item ml-1" }, [
        h("img", {
          staticClass: "swap-form-tips_route-item__image",
          domProps: { src: asset.logo },
        }),
        h("span", [asset.display_symbol || asset.symbol]),
        !isLast &&
          h(
            VIcon,
            {
              staticClass: "ml-1",
              props: { size: 12 },
            },
            [this.$icons.mdiArrowRight]
          ),
      ]);
    };
    const routes =
      this.routes.length > 0
        ? this.routes.map((v, i) => genRouteItem(v, i))
        : [" - "];
    return h("div", { staticClass: "swap-form-tips_routes" }, [
      this.$t("tip.label.routes") as string,
      ...routes,
    ]);
  },
});

@Component({
  components: {
    PriceInfo,
    SwapRoutes,
  },
})
class SwapFormTips extends Vue {
  @Getter("global/getBalanceByAssetId") getBalanceByAssetId;

  @Prop() inputAsset!: API.Asset | null;

  @Prop() outputAsset!: API.Asset | null;

  @Prop() inputAmount!: string;

  @Prop() outputAmount!: string;

  @Prop() preOrder!: API.SwapOrder | null;

  @Prop() preOrderError!: string | null;

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
      return ` 1 ${amountSymbol} ≈ ${price} ${fundsSymbol}`;
    };

    let price;
    if (amount !== 0 && funds !== 0) {
      price =
        this.priceDirection === 0
          ? getPrice(amount, funds, amountSymbol, fundsSymbol)
          : getPrice(funds, amount, fundsSymbol, amountSymbol);
    }

    let fee;
    const len = (this.preOrder?.route_assets?.length ?? 0) - 1;
    const feePercent = Number(this.pair?.fee_percent ?? 0);
    if (len > 0) {
      let received = new bignumber(1 - feePercent).pow(len).times(funds);
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
      routes: this.preOrder?.route_assets ?? [],
      inputAssetSymbol: this.inputAsset?.symbol ?? "",
      outputAssetSymbol: this.outputAsset?.symbol ?? "",
    };
  }

  get perOrderError() {
    if (this.preOrderError) {
      return this.$t(this.preOrderError);
    }
    return null;
  }

  get tips() {
    const feeText = this.meta.fee
      ? ` ≈ ${this.meta.fee} ${this.meta.inputAssetSymbol}`
      : " - ";
    const minReceivedText = this.meta.minReceived
      ? ` ≈ ${this.meta.minReceived} ${this.meta.outputAssetSymbol}`
      : " - ";
    const tips: any[] = [
      {
        component: "base-balance-field",
      },
      {
        component: PriceInfo,
      },
      {
        text: this.$t("tip.label.fee") + feeText,
      },
      {
        text: this.$t("tip.label.min-recevied") + minReceivedText,
      },
      {
        component: SwapRoutes,
      },
    ];

    if (this.perOrderError) {
      tips.unshift({
        text: this.perOrderError,
        error: true,
      });
    }
    return tips;
  }

  handleSwitchPrice() {
    this.priceDirection = (this.priceDirection + 1) % 2;
  }
}
export default SwapFormTips;
</script>

<style lang="scss" scoped>
::v-deep {
  .swap-form-tips_price {
    word-break: break-word;
  }

  .swap-form-tips_routes {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .swap-form-tips_route-item {
      display: flex;
      align-items: center;
      margin: 4px 0;

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

  .caption {
    font-size: 13px !important;
  }
}
</style>
