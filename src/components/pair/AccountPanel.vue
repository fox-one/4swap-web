<template>
  <div>
    <div class="text-center">
      <base-fiat-division :parts="meta.totalValueParts" class="liquidity" />
      <div class="share mt-3">{{ meta.shareText }}</div>
    </div>

    <account-profit-informations :pair="pair" class="mt-8" />

    <div class="pt-2 greyscale_6 mx-n4" />

    <div class="label-1 mt-8">{{ $t("history") }}</div>
    <account-transactions :pair="pair" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";
import { AccountPair } from "@/utils/pair/helper";
import AccountProfitInformations from "./AccountProfitInformations.vue";
import AccountTransactions from "./AccountTransactions.vue";

@Component({
  components: {
    AccountProfitInformations,
    AccountTransactions,
  },
})
class AccountPanel extends Vue {
  @Prop() pair!: API.Pair;

  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const format = this.$utils.number.format;
    const getAccountPair = this.$store.getters[GlobalGetters.GET_ACCOUNT_PAIR];
    const getPairMeta = this.$utils.pair.getPairMeta;

    const { shared } = getAccountPair(this.pair) as AccountPair;
    const { liquidityAsset } = getPairMeta(this, this.pair) || {};

    const totalValue = shared?.totalValue ?? 0;
    const totalValueParts = toFiat(this, { n: totalValue }, true);
    const shareText =
      format({ n: shared?.balance ?? "" }) + " " + liquidityAsset?.symbol ?? "";

    return { totalValueParts, shareText };
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

.share {
  font-size: 12px;
  color: var(--v-greyscale_4-base);
}
</style>
