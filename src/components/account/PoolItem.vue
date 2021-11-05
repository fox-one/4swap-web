<template>
  <div class="greyscale_6 rounded pa-6 mb-4">
    <v-layout align-center>
      <v-layout class="left">
        <base-pair-icon
          size="40"
          :base-asset="meta.baseAsset"
          :quote-asset="meta.quoteAsset"
        />

        <div class="ml-3">
          <div class="value">{{ meta.totalValuetext }}</div>
          <div class="symbol mt-1">{{ meta.symbol }} {{ $t("liquidity") }}</div>
        </div>
      </v-layout>

      <v-btn fab width="32" height="32" @click="handleToDetail">
        <v-icon size="16">$FIconChevronRight4PBold</v-icon>
      </v-btn>
    </v-layout>

    <pool-item-informations :items="informations" class="mt-8" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { AccountPair } from "@/utils/pair/helper";
import PoolItemInformations from "./PoolItemInformations.vue";

@Component({
  components: {
    PoolItemInformations,
  },
})
class PoolItem extends Vue {
  @Prop() pair!: AccountPair;

  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const toPercent = this.$utils.number.toPercent;
    const format = this.$utils.number.format;
    const getPairMeta = this.$utils.pair.getPairMeta;
    const pairMeta = getPairMeta(this, this.pair);

    const { profit, shared } = this.pair;
    const { baseAsset, quoteAsset, symbol } = pairMeta || {};

    const fiatProfit = profit?.fiatProfit ?? 0;
    const fiatProfitText = toFiat(this, { n: Math.abs(fiatProfit) });
    const totalValue = shared?.totalValue ?? 0;
    const totalValuetext = toFiat(this, { n: totalValue });
    const percent = shared?.percent ?? 0;
    const percentText = toPercent({ n: percent });
    const sharedBaseAmount = shared?.sharedBaseAmount ?? 0;
    const sharedQuoteAmount = shared?.sharedQuoteAmount ?? 0;
    const sharedBaseAmountText = format({ n: sharedBaseAmount, dp: 8 });
    const sharedQuoteAmountText = format({ n: sharedQuoteAmount, dp: 8 });

    return {
      baseAsset,
      quoteAsset,
      symbol,
      totalValue,
      fiatProfit,
      fiatProfitSign: +fiatProfit > 0 ? "+" : +fiatProfit < 0 ? "-" : "",
      fiatProfitText,
      totalValuetext,
      percentText,
      sharedBaseAmountText,
      sharedQuoteAmountText,
    };
  }

  get informations() {
    const h = this.$createElement;
    const fiatText = this.meta.fiatProfitSign + " " + this.meta.fiatProfitText;

    return [
      {
        title: this.$t("profits"),
        value: h(
          "span",
          {
            staticStyle: {
              color: this.$utils.color.getColor(this, this.meta.fiatProfit),
            },
          },
          [fiatText]
        ),
      },
      {
        title: this.$t("liquidity.percent.abbr"),
        value: this.meta.percentText,
      },
      {
        title: this.meta.baseAsset?.symbol,
        value: this.meta.sharedBaseAmountText,
      },
      {
        title: this.meta.quoteAsset?.symbol,
        value: this.meta.sharedQuoteAmountText,
      },
    ];
  }

  handleToDetail() {
    this.$router.push({
      name: "pair-detail",
      query: { base: this.pair.base_asset_id, quote: this.pair.quote_asset_id },
    });
  }
}
export default PoolItem;
</script>

<style lang="scss" scoped>
.left {
  margin-top: -2px;
  padding-top: -2px;
}

.value {
  font-weight: 600;
  font-size: 16px;
}

.symbol {
  font-size: 12px;
  color: var(--v-greyscale_3-base);
}

.pair-icon {
  ::v-deep {
    .v-sheet {
      background-color: var(--v-greyscale_6-base);
    }
  }
}
</style>
