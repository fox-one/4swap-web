<template>
  <div>
    <div class="label-1">{{ $t("me.total.lp_balance") }}</div>

    <div class="mt-6">
      <base-fiat-division :parts="meta.parts" class="balance" />
      <span :style="{ color: meta.color }" class="profit ml-3">
        {{ meta.profitSymbol + " " + meta.totalProfitText }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GlobalGetters } from "~/store/types";

@Component
class AccountOverview extends Vue {
  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const getters = this.$store.getters;

    const { totalUsd, totalProfit } = getters[GlobalGetters.ACCOUNT_OVERVIEW];
    const parts = toFiat(this, { n: totalUsd }, true);
    const totalProfitText = toFiat(this, { n: Math.abs(totalProfit) });
    const profitSymbol = +totalProfit > 0 ? "+" : "";
    const sign = +totalProfit > 0 ? "+" : +totalProfit < 0 ? "-" : "";
    const color = this.$utils.color.getColor(this, totalProfit);

    return {
      parts,
      totalProfit,
      color,
      totalProfitText: sign + " " + totalProfitText,
      profitSymbol,
    };
  }
}
export default AccountOverview;
</script>

<style lang="scss" scoped>
.balance {
  font-size: 25px;
  font-weight: 700;
  letter-spacing: -0.02em;

  ::v-deep {
    .symbol {
      font-size: 16px;
    }
  }
}

.profit {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.011em;
}
</style>
