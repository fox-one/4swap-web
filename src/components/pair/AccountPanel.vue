<template>
  <div>
    <div v-if="meta.isAdded">
      <div class="text-center top-section mt-4">
        <base-fiat-division :parts="meta.totalValueParts" class="liquidity" />
        <div class="share-text mt-3">
          {{ meta.shareText }}

          <base-mvm-action :asset="meta.liquidityAsset" />
        </div>

        <account-profits-chart :pair="pair" class="mt-8 text-left" />
      </div>

      <account-profit-informations :pair="pair" class="mt-6" />
    </div>
    <account-liquidity-placeholder
      v-else
      :symbol="meta.symbol"
      v-on="$listeners"
    />

    <div class="mx-n4">
      <div class="pt-2 greyscale_6" />
    </div>

    <div class="label-1 mt-8 mb-4">{{ $t("my.history") }}</div>
    <account-transactions :pair="pair" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";
import { AccountPair } from "@/utils/pair/helper";
import AccountProfitInformations from "./AccountProfitInformations.vue";
import AccountTransactions from "./AccountTransactions.vue";
import AccountProfitsChart from "./AccountProfitsChart.vue";
import AccountLiquidityPlaceholder from "./AccountLiquidityPlaceholder.vue";
import { GlobalActions } from "@/store/types";

@Component({
  components: {
    AccountProfitInformations,
    AccountTransactions,
    AccountProfitsChart,
    AccountLiquidityPlaceholder,
  },
})
class AccountPanel extends Vue {
  @Prop() pair!: API.Pair;

  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const format = this.$utils.number.format;
    const getAccountPair = this.$store.getters[GlobalGetters.GET_ACCOUNT_PAIR];
    const getIsLiquidityAdded =
      this.$store.getters[GlobalGetters.GET_IS_LIQUIDITY_ADDED];
    const getPairMeta = this.$utils.pair.getPairMeta;

    const { shared } = getAccountPair(this, this.pair) as AccountPair;
    const { liquidityAsset, symbol } = getPairMeta(this, this.pair) || {};

    const isAdded = getIsLiquidityAdded(this, this.pair);
    const totalValue = shared?.totalValue ?? 0;
    const totalValueParts = toFiat(this, { n: totalValue }, true);
    const shareText =
      format({ n: shared?.balance ?? "" }) + " " + liquidityAsset?.symbol ?? "";

    return { totalValueParts, shareText, isAdded, symbol, liquidityAsset };
  }

  mounted() {
    const { base_asset_id, quote_asset_id } = this.pair;

    this.$store.dispatch(GlobalActions.LOAD_PROFIT, {
      base: base_asset_id,
      quote: quote_asset_id,
    });
  }
}
export default AccountPanel;
</script>

<style lang="scss" scoped>
.liquidity {
  font-size: 25px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-feature-settings: "salt" on;

  ::v-deep {
    .symbol {
      font-size: 16px;
    }
  }
}

.share-text {
  display: flex;
  justify-content: center;
  font-size: 12px;
  color: var(--v-greyscale_4-base);
}
</style>
