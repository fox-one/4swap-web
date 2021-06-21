<template>
  <v-container class="pa-0">
    <f-loading v-if="loading" :loading="loading" fullscreen></f-loading>
    <f-panel class="pa-4 pt-0 pb-8 no-border-radius">
      <base-asset-selector :assets="baseAssets" v-model="baseAsset" />
      <v-layout justify-center class="my-4">
        <v-icon size="24">
          {{ $icons.mdiPlus }}
        </v-icon>
      </v-layout>
      <base-asset-selector :assets="quoteAssets" v-model="quoteAsset" />
      <div class="mt-6 px-4 d-flex flex-column align-center f-caption">
        <span class="align-self-start">{{ $t("fees") }}</span>
        <v-layout class="mt-4 mb-6">
          <f-mixin-asset-logo :logo="meta.costLogo" :size="36" />
          <div class="ml-3">
            <div class="f-headline">{{ meta.costText }}</div>
            <div class="f-greyscale-3">{{ `≈ $ ${meta.costPrice}` }}</div>
          </div>
        </v-layout>
        <div
          class="alreay-exists mb-6"
          v-show="isExists"
          v-html="$t('liquidity.create.alreay.exists')"
          @click="goPairInfo"
        />
      </div>
      <liq-create-action
        :pair="pair"
        :baseAsset="baseAsset"
        :quoteAsset="quoteAsset"
        :costText="meta.costText"
        :disabled="!canCreate"
        :traceId="traceId"
        :costId="costId"
        :costAmount="costAmount"
      />
    </f-panel>
    <liq-create-rules />
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { Getter, State } from "vuex-class";
import BigNumber from "bignumber.js";
import { v4 as uuid } from "uuid";
import LiqCreateAction from "@/components/particles/liquidity/LiqCreateAction.vue";
import LiqCreateRules from "@/components/particles/liquidity/LiqCreateRules.vue";

@Component({
  components: {
    LiqCreateAction,
    LiqCreateRules,
  },
})
class CreateLiquidityPage extends Mixins(mixins.page) {
  @Getter("global/getAssetsWithoutPairs") assets!: API.Asset[];

  @Getter("global/getPair") getPair;

  @State((state) => state.global.pairs) pairs!: API.Pair[];

  locked = false;

  loading = false;

  baseAsset = null as any;

  quoteAsset = null as any;

  costAmount = 0.2;

  costId = "43d61dcd-e413-450d-80b8-101d5e903357";

  traceId = uuid();

  get title() {
    return this.$t("liquidity.create.title") as string;
  }

  get appbar() {
    return {
      align: "center",
    };
  }

  get canCreate() {
    return !!(!this.isExists && this.baseAsset && this.quoteAsset);
  }

  get isExists() {
    if (!this.baseAsset || !this.quoteAsset) return false;

    return !!this.pairs?.find((pair) => {
      return (
        (pair.base_asset_id === this.baseAsset?.id &&
          pair.quote_asset_id === this.quoteAsset?.id) ||
        (pair.base_asset_id === this.quoteAsset?.id &&
          pair.quote_asset_id === this.baseAsset?.id)
      );
    });
  }

  get baseAssets() {
    if (!this.quoteAsset) {
      return this.assets;
    }
    return this.assets.filter((x) => this.quoteAsset?.id !== x.id);
  }

  get quoteAssets() {
    if (!this.baseAsset) {
      return this.assets;
    }
    return this.assets.filter((x) => this.baseAsset?.id !== x.id);
  }

  get pair(): API.Pair | undefined {
    const input = this.baseAsset?.id;
    const output = this.quoteAsset?.id;
    return this.getPair({ base: input, quote: output });
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
    const costInfo = this.assets.find((asset) => {
      return asset.id === this.costId;
    });

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
      costLogo: costInfo?.logo,
      costPrice: Math.round(+(costInfo?.price || 0) * this.costAmount),
      costText: `${this.costAmount} ${costInfo?.symbol}`,
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
    await this.setInitialAsset();
  }

  @Watch("baseAsset")
  handleBaseAmountChange() {
    const jumpUrl = this.$route.query.jumpUrl;
    this.$router.replace({
      query: { quote: this.quoteAsset?.id, base: this.baseAsset?.id, jumpUrl },
    });
  }

  @Watch("quoteAsset")
  handleQuoteAmountChange() {
    const jumpUrl = this.$route.query.jumpUrl;
    this.$router.replace({
      query: { quote: this.quoteAsset?.id, base: this.baseAsset?.id, jumpUrl },
    });
  }

  async setInitialAsset() {
    const info = await this.$http.getApplieInfo();
    const { amount, asset_id } = info?.data ?? {};
    this.costAmount ??= +amount;
    this.costId ??= asset_id;
    const baseAssetId = this.$route.query.base || this.baseAsset?.id;
    const quoteAssetId = this.$route.query.quote || this.quoteAsset?.id;
    const baseAsset = this.assets.find((a) => a.id === baseAssetId);
    const quoteAsset = this.assets.find((a) => a.id === quoteAssetId);
    this.baseAsset = baseAsset || null;
    this.quoteAsset = quoteAsset || null;
  }

  goPairInfo(e) {
    if (
      e.target.tagName.toLowerCase() !== "strong" ||
      !this.baseAsset ||
      !this.quoteAsset
    )
      return;
    this.$router.push({
      name: "pair-info",
      query: { base: this.baseAsset.id, quote: this.quoteAsset.id },
    });
  }
}
export default CreateLiquidityPage;
</script>
<style lang="scss" scoped>
.alreay-exists {
  ::v-deep {
    & strong {
      color: var(--v-primary-base);
    }
  }
}
</style>
