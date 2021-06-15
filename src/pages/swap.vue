<template>
  <v-container class="pa-0 page-swap">
    <f-loading v-if="!pairsAvaliable" :loading="!pairsAvaliable" fullscreen />
    <f-panel class="px-0 pt-7" style="overflow: hidden; max-width: 100vw">
      <div class="px-4">
        <base-asset-amount-input
          v-model="inputAmount"
          :label="$t('swap.from')"
          :assets="assets"
          :selectable="meta.hasAssets"
          :asset.sync="inputAsset"
          :precision="8"
          @blur="handleBlur('input')"
        />
        <v-layout justify-space-between align-center>
          <div
            :style="bgColor"
            class="my-2 ml-3 page-swap-switch"
            @click="handleSwitch"
          >
            <v-layout align-center>
              <v-icon color="primary">{{ $icons.mdiSwapVertical }}</v-icon>
            </v-layout>
          </div>
          <div class="f-greyscale-3 f-body-2">
            {{ $t("balance.abbr") }}
            <span class="primary--text" @click="handleFillBalance(balance)">
              {{ balance }}
            </span>
            <span class="f-caption" style="font-weight: 600 !important">{{
              inputAsset && inputAsset.symbol
            }}</span>
          </div>
        </v-layout>

        <base-asset-amount-input
          v-model="outputAmount"
          :label="$t('swap.to')"
          :assets="assets"
          :selectable="meta.hasAssets"
          :asset.sync="outputAsset"
          :precision="8"
          @blur="handleBlur('output')"
        />

        <v-layout
          class="mt-5"
          v-show="routes.length > 0"
          justify-center
          align-center
        >
          <div class="f-greyscale-3 f-caption">{{ $t("route") + ":" }}</div>
          <div v-for="(assetId, ind) of routes" :key="ind">
            <route-item
              :assetId="assetId"
              :isFirst="ind === 0"
              :isLast="ind === routes.length - 1"
            />
          </div>
        </v-layout>
        <div class="my-5">
          <base-connect-wallet-btn v-if="!isLogged" />
          <swap-submit-action
            v-else
            :inputAsset="inputAsset"
            :outputAsset="outputAsset"
            :inputAmount="inputAmount"
            :outputAmount="outputAmount"
            :preOrder="preOrder"
            :pair="pair"
            :impact="meta.impact"
            :impact-value="meta.impactValue"
            @refresh="handleReset"
          />
        </div>
      </div>
      <swap-info-panel
        :inputAsset="inputAsset"
        :outputAsset="outputAsset"
        :inputAmount="inputAmount"
        :outputAmount="outputAmount"
        :preOrder="preOrder"
        :preOrderError="preOrderError"
        :pair="pair"
        :impact="meta.impact"
        :impact-value="meta.impactValue"
      />
    </f-panel>

    <div class="px-4">
      <pair-liquidity-pool
        v-if="pair"
        :pair="pair"
        :inputAsset="inputAsset"
        :outputAsset="outputAsset"
      />
      <recently-transactions
        v-if="pair"
        :pair="pair"
        :inputAsset="inputAsset"
        :outputAsset="outputAsset"
      />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import SwapTabs from "@/components/particles/swap/SwapTabs.vue";
import PairLiquidityPool from "@/components/particles/swap/PairLiquidityPool.vue";
import SwapFormTips from "@/components/particles/swap/SwapFormTips.vue";
import SwapInfoPanel from "@/components/particles/swap/SwapInfoPanel.vue";
import SwapSubmitAction from "@/components/particles/swap/SwapSubmitAction.vue";
import RecentlyTransactions from "@/components/particles/swap/RecentlyTransactions.vue";
import { Getter } from "vuex-class";
import { BTC_ASSET_ID, DEFAULT_ASSET_ID, PRSID } from "@/constants";
import { debounce } from "~/utils/helper";

const RouteItem = Vue.extend({
  props: {
    assetId: String,
    isLast: Boolean,
    isFirst: Boolean,
  },
  render(h) {
    const assets = this.$store.state.global.assets;
    const asset = assets.find((a) => a.id === this.assetId);
    if (!asset) return null as any;
    return h(
      "div",
      {
        staticClass: `d-flex align-center ${this.isFirst ? "ml-1" : ""}`,
      },
      [
        h("f-mixin-asset-logo", {
          props: {
            size: 20,
            logo: asset.logo,
            "chain-logo": asset.chain_logo,
          },
        }),
        !this.isLast &&
          h("icon-route", {
            staticClass: "icon-triangle",
          }),
      ]
    );
  },
});

@Component({
  components: {
    SwapTabs,
    SwapFormTips,
    SwapInfoPanel,
    SwapSubmitAction,
    PairLiquidityPool,
    RecentlyTransactions,
    RouteItem,
  },
})
class SwapPage extends Mixins(mixins.page) {
  @Getter("global/getPair") getPair;

  @Getter("global/getBalanceByAssetId") getBalanceByAssetId;

  inputAmount = "";

  outputAmount = "";

  lastUpdate = "";

  lastEdit: "input" | "output" = "input";

  preOrder: API.SwapOrder | null = null;

  preOrderError: any = null;

  locked = false;

  get title() {
    return this.$createElement("base-swap-version-bar", {
      props: {
        title: this.$t("swap"),
      },
    }) as any;
  }

  get htmlTitle() {
    const symbol = `${this.inputAsset?.symbol}-${this.outputAsset?.symbol}`;
    return this.$t("swap.symbol", { symbol: symbol }) as string;
  }

  get appbar() {
    return {
      back: false,
    };
  }

  get bottomNav() {
    return "swap";
  }

  get isLogged() {
    return this.$store.getters["auth/isLogged"];
  }

  get pair(): API.Pair | undefined {
    const base = this.inputAsset?.id;
    const quote = this.outputAsset?.id;
    return this.getPair({ base, quote });
  }

  get assets() {
    const assets: API.Asset[] = this.$store.getters["global/getSortedAssets"];
    const pairs: API.Pair[] = this.$store.state.global.pairs;
    return assets.filter((x) => {
      // @TODO prs event
      if (x.id === PRSID) {
        return false;
      }
      return pairs.find((pair) => {
        return pair.base_asset_id === x.id || pair.quote_asset_id === x.id;
      });
    });
  }

  get routes() {
    return this.preOrder ? this.preOrder.route_assets : [];
  }

  get balance() {
    return this.getBalanceByAssetId(this.inputAsset?.id);
  }

  get inputAsset() {
    return this.$store.state.swap.inputAsset;
  }

  set inputAsset(value) {
    if (value?.id === this.outputAsset?.id) {
      this.$store.commit("swap/SET_OUTPUT_ASSET", this.inputAsset);
    }
    this.$store.commit("swap/SET_INPUT_ASSET", value);
  }

  get outputAsset() {
    return this.$store.state.swap.outputAsset;
  }

  set outputAsset(value) {
    if (value?.id === this.inputAsset?.id) {
      this.$store.commit("swap/SET_INPUT_ASSET", this.outputAsset);
    }
    this.$store.commit("swap/SET_OUTPUT_ASSET", value);
  }

  get pairsAvaliable() {
    return this.$store.getters["global/getPairsAvaliable"];
  }

  get meta() {
    const needAddLiquidity =
      this.inputAsset && this.outputAsset && this.pair?.liquidity === "0";
    const impactValue = this.preOrder?.price_impact;
    let impact = "-";
    if (impactValue !== undefined) {
      impact = this.$utils.number.toPercent(Math.abs(impactValue), false);
    }

    return {
      impact,
      impactValue,
      hasAssets: this.assets?.length > 0,
      needAddLiquidity,
    };
  }

  get bgColor() {
    const isDark = this.$store.state.app.dark;
    return { "background-color": isDark ? "#191919" : "#f5f5f5" };
  }

  async mounted() {
    this.setInitialAsset();
  }

  @Watch("outputAmount")
  handleOutputAmountChange() {
    if (this.locked) return;
    if (!this.outputAmount) {
      this.handleReset();
      return;
    }
    this.requestPreOrder({ amount: this.outputAmount });
    this.lastUpdate = "output";
  }

  @Watch("inputAmount")
  handleInputAmountChange() {
    if (this.locked) return;
    if (!this.inputAmount) {
      this.handleReset();
      return;
    }
    this.requestPreOrder({ funds: this.inputAmount });
    this.lastUpdate = "input";
  }

  @Watch("inputAsset", { immediate: true })
  loadAssetBalance() {
    if (this.inputAsset?.id) {
      this.$utils.helper.loadWalletAssets(this);
    }
  }

  @Watch("inputAsset")
  @Watch("outputAsset")
  handleInputAssetChange() {
    this.handleReplaceRouter();
    this.setLRUCache();
    this.preOrder = null;
    this.preOrderError = null;
    if (this.locked) return;
    if (this.inputAmount && this.outputAmount) {
      if (this.lastUpdate === "input") {
        this.requestPreOrder({ funds: this.inputAmount });
      } else {
        this.requestPreOrder({ amount: this.outputAmount });
      }
    } else if (this.inputAmount) {
      this.requestPreOrder({ funds: this.inputAmount });
    } else if (this.outputAmount) {
      this.requestPreOrder({ amount: this.outputAmount });
    }
  }

  setInitialAsset() {
    const input =
      this.$route.query.input || this.inputAsset?.id || DEFAULT_ASSET_ID;
    const output =
      this.$route.query.output || this.outputAsset?.id || BTC_ASSET_ID;
    const inputAsset = this.assets.find((a) => a.id === input);
    const outputAsset = this.assets.find((a) => a.id === output);
    this.inputAsset = inputAsset || null;
    this.outputAsset = outputAsset || null;
  }

  setLRUCache() {
    const set = (id) => this.$store.commit("global/PUT_CACHE", id);
    if (this.outputAsset?.id) {
      set(this.outputAsset.id);
    }
    if (this.inputAsset?.id) {
      set(this.inputAsset.id);
    }
  }

  handleReplaceRouter() {
    this.$router
      .replace({
        query: { input: this.inputAsset?.id, output: this.outputAsset?.id },
      })
      .catch((e) => console.log(e));
  }

  handleReset() {
    this.inputAmount = "";
    this.outputAmount = "";
    this.preOrder = null;
    this.preOrderError = null;
    this.loadAssetBalance();
  }

  handleBlur(side: "input" | "output") {
    this.lastEdit = side;
  }

  handleSwitch() {
    this.locked = true;
    const swich = () =>
      (this.lastEdit = this.lastEdit === "input" ? "output" : "input");
    if (this.lastEdit === "input") {
      this.outputAsset = this.inputAsset;
      this.outputAmount = this.inputAmount;
      this.$nextTick(() => {
        this.locked = false;
        this.handleOutputAmountChange();
        swich();
      });
    } else {
      this.inputAsset = this.outputAsset;
      this.inputAmount = this.outputAmount;
      this.$nextTick(() => {
        this.locked = false;
        this.handleInputAmountChange();
        swich();
      });
    }
  }

  handleRecivePreOrder(preOrder, params) {
    this.preOrderError = null;
    this.preOrder = preOrder;
    this.locked = true;
    if (params.amount) {
      this.inputAmount = preOrder.funds;
    } else {
      this.outputAmount = preOrder.amount;
    }
    this.$nextTick(() => (this.locked = false));
  }

  handlePreOrderError(error, params) {
    this.preOrderError = error;
    this.preOrder = null;
    this.locked = true;
    if (params.amount) {
      this.inputAmount = "";
    } else {
      this.outputAmount = "";
    }
    this.$nextTick(() => (this.locked = false));
  }

  requestPreOrder = debounce(async (params: any = {}) => {
    try {
      const result = await this.$pairRoutes.getPreOrder({
        inputAsset: this.inputAsset?.id,
        outputAsset: this.outputAsset?.id,
        inputAmount: params.funds,
        outputAmount: params.amount,
      });
      this.handleRecivePreOrder(result, params);
    } catch (error) {
      this.handlePreOrderError(error, params);
    }
  }, 100);

  handleFillBalance(val: string) {
    this.inputAmount = val;
  }
}
export default SwapPage;
</script>

<style lang="scss" scoped>
.page-swap {
  padding-bottom: 54px !important;
  &-switch {
    display: inline-block;
    border-radius: 16px;
    padding: 6px;
  }
}

::v-deep {
  .icon-triangle {
    margin: 0 2px;
  }
}
</style>
