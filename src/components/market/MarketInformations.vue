<template>
  <div class="informations">
    <div v-for="(item, index) in items" class="information" :key="index">
      <div class="label-3">
        {{ item.title }}
      </div>

      <div class="value mt-4">
        <Render :nodes="item.value" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GlobalGetters } from "~/store/types";
import Render from "../base/Render";

@Component({ components: { Render } })
class MarketInformations extends Vue {
  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const format = this.$utils.number.format;

    const getters = this.$store.getters;
    const {
      totalUSDValue,
      volume24h,
      fee24h,
      transactions,
      turnover24h,
    } = getters[GlobalGetters.POOL_OVERVIEW];

    const totalFiatText = toFiat(this, { n: totalUSDValue, short: true }, true);
    const volume24hText = toFiat(this, { n: volume24h, short: true }, true);
    const tradesText = format({ n: transactions });
    const fee24hText = toFiat(this, { n: fee24h, short: true }, true);

    return {
      totalFiatText,
      volume24hText,
      tradesText,
      fee24hText,
      turnover24h,
    };
  }

  get items() {
    const h = this.$createElement;

    return [
      {
        title: this.$t("statistic.label.global-liquidity"),
        value: h("base-fiat-division", {
          props: { parts: this.meta.totalFiatText },
        }),
      },
      {
        title: this.$t("volume.24hours"),
        value: h("base-fiat-division", {
          props: { parts: this.meta.volume24hText },
        }),
      },
      {
        title: this.$t("trades.24hours"),
        value: this.meta.tradesText,
      },
      {
        title: this.$t("fees.24hours"),
        value: h("base-fiat-division", {
          props: { parts: this.meta.fee24hText },
        }),
      },
      {
        title: this.$t("pool_turnover.24hours"),
        value: h("base-percent-division", {
          props: { value: this.meta.turnover24h },
        }),
      },
    ];
  }
}
export default MarketInformations;
</script>

<style lang="scss" scoped>
.informations {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  row-gap: 20px;

  .information .value {
    font-size: 25px;
    font-weight: bold;
    font-feature-settings: "salt" on;
  }
}
</style>
