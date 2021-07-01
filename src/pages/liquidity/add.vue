<template>
  <v-container class="pa-0">
    <f-loading v-if="loading" :loading="loading" fullscreen></f-loading>
    <f-panel class="py-4 pt-0 pb-8 no-border-radius">
      <div class="pt-3">
        <base-asset-amount-input
          v-model="baseAmount"
          :label="pair ? $t('liquidity.input-1') : ''"
          :assets="baseAssets"
          :selectable="meta.hasAssets"
          :asset.sync="baseAsset"
          :precision="8"
          :disabled="!pair"
          @blur="handleInputBlur"
        />
        <base-balance-field
          :balance="meta.baseAssetBalance"
          :symbol="meta.baseAssetSymbol"
          class="f-caption f-greyscale-3 mx-3 my-2"
          @click:balance="baseAmount = meta.baseAssetBalance"
        />
      </div>
      <div class="mt-5">
        <base-asset-amount-input
          v-model="quoteAmount"
          :label="pair ? $t('liquidity.input-2') : ''"
          :assets="quoteAssets"
          :selectable="meta.hasAssets"
          :asset.sync="quoteAsset"
          :precision="8"
          :disabled="!pair"
          @blur="handleInputBlur"
        />
        <base-balance-field
          :balance="meta.quoteAssetBalance"
          :symbol="meta.quoteAssetSymbol"
          class="f-caption f-greyscale-3 mx-3 my-2"
          @click:balance="quoteAmount = meta.quoteAssetBalance"
        />
      </div>
      <div v-if="!pair" class="mt-4 pl-4 pr-6 f-caption">
        {{ $t("liquidity.add.create.hint") }}
      </div>
      <liq-add-action
        :pair="pair"
        :baseAsset="baseAsset"
        :quoteAsset="quoteAsset"
        :baseAmount="baseAmount"
        :quoteAmount="quoteAmount"
        :disabled="!canAdd"
      />
    </f-panel>
    <add-result-forecast
      v-if="pair"
      :pair="pair"
      :baseAsset="baseAsset"
      :quoteAsset="quoteAsset"
      :baseAmount="baseAmount"
      :quoteAmount="quoteAmount"
      :already-has-liquidity="meta.alreadyHasLiquidity"
    />
    <first-liq-provider-tip
      v-if="pair"
      :pair="pair"
      :baseAsset="baseAsset"
      :quoteAsset="quoteAsset"
      :already-has-liquidity="meta.alreadyHasLiquidity"
    />
    <base-swap-introduction />
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { Getter } from "vuex-class";
import BigNumber from "bignumber.js";
import { BTC_ASSET_ID, DEFAULT_ASSET_ID } from "~/constants";
import AddResultForecast from "@/components/particles/liquidity/AddResultForecast.vue";
import LiqAddAction from "@/components/particles/liquidity/LiqAddAction.vue";
import FirstLiqProviderTip from "@/components/particles/liquidity/FirstLiqProviderTip.vue";
import { Asset } from "@/utils/assets";

@Component({
  components: {
    AddResultForecast,
    LiqAddAction,
    FirstLiqProviderTip,
  },
})
class AddLiquidityPage extends Mixins(mixins.page) {
  // @Getter("global/getAssetsWithoutLPTokens") assets!: API.Asset[];

  @Getter("global/getPair") getPair;

  baseAmount = "";

  baseAssetValue: Asset | null = null;

  quoteAmount = "";

  quoteAssetValue: Asset | null = null;

  locked = false;

  loading = false;

  canAdd = false;

  get title() {
    const symbol = `${this.baseAsset?.symbol}-${this.quoteAsset?.symbol}`;
    return this.$t("liquidity.add.symbol", { symbol }) as string;
  }

  get appbar() {
    return {
      title: this.$t("liquidity.add"),
    };
  }

  get assets(): Asset[] {
    const { assets, walletAssets, assetsBlackLists } = this.$store.state.global;
    return this.$utils.assets.getLiquidityAddAvaliableAssets(
      assets,
      walletAssets,
      assetsBlackLists
    );
  }

  get baseAssets() {
    if (!this.quoteAsset) {
      return this.assets;
    }
    return this.assets.filter((x) => {
      return this.quoteAsset?.id !== x.id;
    });
  }

  get quoteAssets() {
    if (!this.baseAsset) {
      return this.assets;
    }
    return this.assets.filter((x) => {
      return this.baseAsset?.id !== x.id;
    });
  }

  get pair(): API.Pair | undefined {
    const input = this.baseAsset?.id;
    const output = this.quoteAsset?.id;
    return this.getPair({ base: input, quote: output });
  }

  get baseAsset(): Asset | null {
    return this.baseAssetValue;
  }

  set baseAsset(value) {
    if (value?.id === this.quoteAsset?.id) {
      this.quoteAssetValue = this.baseAsset;
    }
    this.baseAssetValue = value;
  }

  get quoteAsset(): Asset | null {
    return this.quoteAssetValue;
  }

  set quoteAsset(value) {
    if (value?.id === this.baseAsset?.id) {
      this.baseAssetValue = this.quoteAsset;
    }
    this.quoteAssetValue = value;
  }

  get meta() {
    const getBalance = this.$store.getters["global/getBalanceByAssetId"];
    const pairBaseAmount = Number(this.pair?.base_amount ?? 0);
    const pairQuoteAmount = Number(this.pair?.quote_amount ?? 0);
    const baseAssetBalance = getBalance(this.baseAsset?.id);
    const quoteAssetBalance = getBalance(this.quoteAsset?.id);
    const baseAssetSymbol = this.baseAsset?.symbol ?? "-";
    const quoteAssetSymbol = this.quoteAsset?.symbol ?? "-";
    const alreadyHasLiquidity = pairBaseAmount > 0 && pairQuoteAmount > 0;

    let convertScale: any = 0;
    if (alreadyHasLiquidity) {
      convertScale = new BigNumber(pairQuoteAmount)
        .div(pairBaseAmount)
        .toNumber();
    } else {
      const quotePrice = Number(this.quoteAsset?.price);
      const basePrice = Number(this.baseAsset?.price);
      if (basePrice && quotePrice) {
        convertScale = new BigNumber(basePrice).div(quotePrice).toNumber();
      }
    }

    return {
      convertScale,
      alreadyHasLiquidity,
      baseAssetBalance,
      quoteAssetBalance,
      baseAssetSymbol,
      quoteAssetSymbol,
      hasConvertScale: Number(convertScale) > 0,
      hasAssets: this.assets?.length > 0,
    };
  }

  async mounted() {
    this.setInitialAsset();
  }

  setLRUCache() {
    const set = (id) => this.$store.commit("global/PUT_CACHE", id);
    if (this.baseAsset?.id) {
      set(this.baseAsset.id);
    }
    if (this.quoteAsset?.id) {
      set(this.quoteAsset.id);
    }
  }

  @Watch("baseAsset")
  @Watch("quoteAsset")
  handleAssetChange() {
    this.$router.replace({
      query: { quote: this.quoteAsset?.id, base: this.baseAsset?.id },
    });
    this.setLRUCache();
  }

  @Watch("baseAsset")
  @Watch("baseAmount")
  handleBaseAmountChange() {
    this.canAdd = !!this.meetMinValue();
    if (this.locked || !this.meta.hasConvertScale) return;
    if (this.baseAmount === "") {
      this.quoteAmount = "";
      return;
    }
    this.locked = true;
    const amount = new BigNumber(this.baseAmount)
      .times(this.meta.convertScale)
      .decimalPlaces(8)
      .toString();
    this.quoteAmount = amount;
    this.$nextTick(() => (this.locked = false));
  }

  @Watch("quoteAsset")
  @Watch("quoteAmount")
  handleQuoteAmountChange() {
    this.canAdd = !!this.meetMinValue();
    if (this.locked || !this.meta.hasConvertScale) return;
    if (this.quoteAmount === "") {
      this.baseAmount = "";
      return;
    }
    this.locked = true;
    const amount = new BigNumber(this.quoteAmount)
      .div(this.meta.convertScale)
      .decimalPlaces(8)
      .toString();
    this.baseAmount = amount;
    this.$nextTick(() => (this.locked = false));
  }

  setInitialAsset() {
    const baseAssetId =
      this.$route.query.base || this.baseAsset?.id || DEFAULT_ASSET_ID;
    const quoteAssetId =
      this.$route.query.quote || this.quoteAsset?.id || BTC_ASSET_ID;
    const baseAsset = this.assets.find((a) => a.id === baseAssetId);
    const quoteAsset = this.assets.find((a) => a.id === quoteAssetId);
    this.baseAsset = baseAsset || null;
    this.quoteAsset = quoteAsset || null;
  }

  meetMinValue() {
    if (!this.pair) return true;
    const { liquidity, base_amount, quote_amount } = this.pair;
    const min =
      Math.min(
        +this.baseAmount / +base_amount,
        +this.quoteAmount / +quote_amount
      ) * +liquidity;
    if (min < 0.00000001) {
      return false;
    }
    return true;
  }

  handleInputBlur() {
    setTimeout(() => {
      if (
        !this.meetMinValue() &&
        this.baseAmount !== "" &&
        this.quoteAmount !== ""
      ) {
        this.$utils.helper.toast(this, {
          message: this.$t("liquidity.add.min.hint") as string,
          color: "orange lighten-1",
        });
      }
    }, 500);
  }
}
export default AddLiquidityPage;
</script>
