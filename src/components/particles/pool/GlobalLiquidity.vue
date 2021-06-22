<template>
  <v-layout @click="handleToGlabol" align-center>
    <v-flex>
      <div class="f-caption f-greyscale-3">
        <span> {{ $t("statistic.label.global-liquidity") }}: </span>

        <span class="val">{{ meta.totalText }}</span>
      </div>
    </v-flex>
    <div class="text-right">
      <div class="f-caption f-greyscale-3 text-right">
        <span> {{ $t("statistic.label.global-volume-24h") }}: </span>
        <span class="val">{{ meta.volumeText }}</span>
      </div>
    </div>
    <v-icon size="18" class="ml-2">
      {{ $icons.mdiChevronRight }}
    </v-icon>
  </v-layout>
</template>

<script lang="ts">
import BigNumber from "bignumber.js";
import { Component, Vue } from "vue-property-decorator";

@Component
class GlobalLiquidity extends Vue {
  get meta() {
    const simplizeFiat = this.$utils.number.simplizeFiat;

    const info = this.$store.state.global.info;
    const pairs = this.$store.getters["global/getAvaliablePairs"];

    const totalUSDValue = pairs.reduce((total, p) => {
      return total.plus(p.base_value).plus(p.quote_value);
    }, new BigNumber(0));
    const formatedTotalUSDValue = simplizeFiat(this, totalUSDValue, 4);

    const formatedVolume = simplizeFiat(this, info.volume_24h, 4);

    return {
      totalText: formatedTotalUSDValue,
      volumeText: formatedVolume,
    };
  }

  handleToGlabol() {
    this.$router.push({ name: "statistic-global" });
  }

  formatFiat(amountUsd, fraction = -1) {
    return this.$utils.number.formatFiat.call(this, this, amountUsd, fraction);
  }
}
export default GlobalLiquidity;
</script>

<style lang="scss" scoped>
.val {
  font-weight: bold;
  font-size: 12px;
}
</style>
