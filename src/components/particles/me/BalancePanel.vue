<template>
  <f-panel class="no-border-radius">
    <div class="f-caption f-greyscale-3 d-flex align-center">
      {{ isTotalBalance ? $t("me.total.balance") : $t("me.total.lp_balance") }}
      <i
        @click="flipBalance"
        style="display: inline-flex; align-items: center; margin-left: 8px"
      >
        <icon-refresh />
      </i>
    </div>
    <v-layout
      justify-space-between
      align-center
      class="mt-2 mb-5"
      style="height: 30px"
    >
      <div class="f-headline">
        {{ isTotalBalance ? `${totalBalance}` : `${totalLpBalance}` }}
      </div>
      <f-button
        text
        small
        color="primary"
        @click="handleAddLiquidity"
        class="f-title-2"
      >
        {{ $t("liquidity.add") }}
      </f-button>
    </v-layout>
    <f-input
      v-model="filter"
      v-on="$listeners"
      hide-details
      flat
      :label="$t('search.pools')"
      class="pa-0 search-bar"
      filled
      clearable
    />
  </f-panel>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  inheritAttrs: false,
})
class BalancePanel extends Vue {
  isTotalBalance = false;

  get totalBalance() {
    return this.formatFiat(this.$store.getters["global/getUserTotalBalance"]);
  }

  get totalLpBalance() {
    return this.formatFiat(this.$store.getters["global/getUserLpBalance"]);
  }

  get filter() {
    return this.$store.state.me.filter;
  }

  set filter(value) {
    this.$store.commit("me/SET_FILTER", value || "");
  }

  flipBalance() {
    this.isTotalBalance = !this.isTotalBalance;
  }

  handleAddLiquidity() {
    this.$router.push({ name: "liquidity-add" });
  }

  mounted() {
    this.$emit("onMount", this.filter);
  }

  formatFiat(amountUsd, fraction = -1) {
    return this.$utils.number.formatFiat.call(this, this, amountUsd, fraction);
  }
}
export default BalancePanel;
</script>

<style lang="scss" scoped></style>
