<template>
  <div class="py-4">
    <v-layout class="mb-3">
      <v-flex>
        <div class="value">{{ meta.totalValue }}</div>
        <div class="text mt-3">{{ meta.text }}</div>
      </v-flex>
      <span class="time">{{ meta.time }}</span>
    </v-layout>

    <div class="items rounded">
      <template v-if="showLiquidityAsset">
        <asset-amount :asset="meta.liquidityAsset" :amount="meta.liquidity" />
      </template>
      <template v-else>
        <asset-amount :asset="meta.baseAsset" :amount="meta.base_amount" />
        <asset-amount :asset="meta.quoteAsset" :amount="meta.quote_amount" />
      </template>

      <liquidity-switch class="switch" @click.native="handleSwitch" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";
import LiquiditySwitch from "./LiquiditySwitch.vue";
import AssetAmount from "./AssetAmount.vue";

@Component({
  components: {
    LiquiditySwitch,
    AssetAmount,
  },
})
class LiquidityTransaction extends Vue {
  @Prop() transaction!: API.Transaction;

  showLiquidityAsset = false;

  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const toRelative = this.$utils.time.toRelative;
    const getAssetById = this.$store.getters[GlobalGetters.GET_ASSET_BY_ID];
    const getPair = this.$store.getters[GlobalGetters.GET_PAIR_BY_IDS];

    const {
      base_asset_id,
      quote_asset_id,
      base_amount,
      quote_amount,
      type,
      liquidity,
    } = this.transaction;

    const pair = getPair(base_asset_id, quote_asset_id);
    const baseAsset = getAssetById(base_asset_id);
    const quoteAsset = getAssetById(quote_asset_id);
    const liquidityAsset = getAssetById(pair.liquidity_asset_id);
    const [text, symbol] =
      type === "Add"
        ? [this.$t("liquidity.add"), "+"]
        : [this.$t("liquidity.remove"), "-"];

    return {
      text,
      baseAsset,
      quoteAsset,
      base_amount,
      quote_amount,
      liquidity,
      liquidityAsset,
      totalValue: symbol + " " + toFiat(this, { n: this.transaction.value }),
      time: toRelative(this.transaction.created_at),
    };
  }

  handleSwitch() {
    this.showLiquidityAsset = !this.showLiquidityAsset;
  }
}
export default LiquidityTransaction;
</script>

<style lang="scss" scoped>
.value {
  font-size: 14px;
  font-weight: 600;
  font-feature-settings: "salt" on;
}

.text {
  font-weight: 500;
  font-size: 12px;
}

.time {
  font-size: 12px;
  color: var(--v-greyscale_4-base);
}

.items {
  background: var(--v-greyscale_6-base);
  color: var(--v-greyscale_3-base);
  padding: 12px;
  display: grid;
  position: relative;
  grid-template-columns: 1fr 1fr;

  .switch {
    position: absolute;
    right: 12px;
    top: calc(50% - 12px);
  }
}
</style>
