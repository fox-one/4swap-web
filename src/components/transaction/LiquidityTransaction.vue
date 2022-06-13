<template>
  <div
    class="pa-4 mx-n4"
    :class="{ 'transaction--expand': expand }"
    @click="handleToggle"
  >
    <v-layout>
      <v-icon size="16" color="greyscale_3">
        {{ meta.icon }}
      </v-icon>

      <v-flex class="ml-4">
        <v-layout class="transaction-title">
          <v-flex>{{ meta.text }}</v-flex>
          <span>{{ meta.totalValue }}</span>
        </v-layout>

        <div v-if="expand">
          <asset-amount :asset="meta.baseAsset" :amount="meta.baseAmount" />
          <asset-amount :asset="meta.quoteAsset" :amount="meta.quoteAmount" />
          <asset-amount :asset="meta.liquidityAsset" :amount="meta.liquidity" />
        </div>

        <v-layout class="transaction-label mt-3">
          <v-flex>{{ meta.time }}</v-flex>
          <div
            class="expand-action"
            :class="{ 'expand-action--active': !expand }"
          >
            <span v-if="expand">{{ $t("less") }}</span>
            <span v-else>{{ $t("more") }}</span>
            <v-icon size="12" color="greyscale_3" class="expand-icon">
              $IconPolygon
            </v-icon>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
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

  expand = false;

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
    const [text, icon] =
      type === "Add"
        ? [this.$t("liquidity.add"), "$FIconAdd4PBold"]
        : [this.$t("liquidity.remove"), "$FIconMinus4PBold"];

    return {
      icon,
      text,
      baseAsset,
      quoteAsset,
      baseAmount: base_amount,
      quoteAmount: quote_amount,
      liquidity,
      liquidityAsset,
      isAdd: type === "Add",
      totalValue: toFiat(this, { n: this.transaction.value }),
      time: toRelative(this.transaction.created_at),
    };
  }

  handleSwitch() {
    this.showLiquidityAsset = !this.showLiquidityAsset;
  }

  handleToggle() {
    this.expand = !this.expand;
  }
}
export default LiquidityTransaction;
</script>

<style lang="scss" scoped>
.transaction-title {
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
}

.transaction-label {
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: var(--v-greyscale_3-base);
}

.transaction--expand {
  background: var(--v-greyscale_6-base);
}

.expand-action {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.expand-action--active {
  .expand-icon {
    transform: rotate(180deg);
    transition: 0.2s ease;
  }
}
</style>
