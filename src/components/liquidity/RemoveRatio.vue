<template>
  <v-layout align-center>
    <span class="label-3">{{ $t("ratio") }}</span>
    <v-flex class="mx-4">
      <f-slider
        :value="meta.percent * 100"
        hide-details
        @change="handleChangeRatio"
      />
    </v-flex>
    <span class="value">{{ meta.percentText }}</span>
  </v-layout>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";
import BigNumber from "bignumber.js";

@Component
class RemoveRatio extends Vue {
  @PropSync("data") bindData;

  get meta() {
    const toPercent = this.$utils.number.toPercent;
    const getBalance = this.$store.getters[GlobalGetters.GET_BALANCE_BY_ID];
    const balance = getBalance(this.bindData.asset?.id) ?? 0;
    const percent = (balance && +this.bindData.amount / balance) || 0;
    const percentText = toPercent({ n: percent });

    return { percentText, balance, percent };
  }

  handleChangeRatio(value: string) {
    if (+this.meta.balance > 0) {
      const amount = new BigNumber(value)
        .div(100)
        .times(this.meta.balance)
        .decimalPlaces(8)
        .toFixed(8);

      this.bindData.amount = amount;
    }
  }
}
export default RemoveRatio;
</script>

<style lang="scss" scoped>
.value {
  font-size: 13px;
  font-weight: 500;
}
</style>
