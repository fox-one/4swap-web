<template>
  <div>
    <base-information-list :items="meta.items" reactive small />

    <div class="label-1 action rounded mt-3" @click="handleClick">
      <v-icon size="16">$FIconConvertDirection4PBold</v-icon>
      <span class="ml-2">{{ $t("swap") }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class PairInformations extends Vue {
  @Prop() pair!: API.Pair;

  @Prop() data;

  rorIndex = 0;

  get rorItems() {
    const getNetRORInDuration = this.$utils.pair.getNetRORInDuration;
    const toPercent = this.$utils.number.toPercent;

    const getRORText = (days: number) => {
      if (this.data.kline.length === 0 && this.data.market.length === 0) {
        return "-";
      }

      const value = getNetRORInDuration(this.pair, this.data, days);

      return toPercent({ n: value, dp: 2, symbol: true });
    };

    return [
      { title: this.$t("ror.24hours"), value: getRORText(1) },
      { title: this.$t("ror.7days"), value: getRORText(7) },
      { title: this.$t("ror.30days"), value: getRORText(30) },
    ];
  }

  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const toPercent = this.$utils.number.toPercent;
    const getPairMeta = this.$utils.pair.getPairMeta;
    const getPriceChangeInDuration = this.$utils.pair.getPriceChangeInDuration;
    const {
      volume,
      volume_24h,
      transaction_count_24h,
      fee_24h,
      turnOver,
    } = getPairMeta(this, this.pair)!;
    const priceChange = getPriceChangeInDuration(this.data.kline, 1);
    const priceChangeText = toPercent({ n: priceChange, dp: 2, symbol: true });

    const items = [
      {
        title: this.$t("volume"),
        value: toFiat(this, { n: volume }),
      },
      {
        title: this.$t("24h.vol"),
        value: toFiat(this, { n: volume_24h }),
      },
      {
        title: this.$t("24h.trades"),
        value: transaction_count_24h ?? "0",
      },
      {
        title: this.$t("24h.fees"),
        value: toFiat(this, { n: fee_24h }),
      },
      {
        title: this.$t("24h.pool-turnover"),
        value: toPercent({ n: turnOver }),
        hint: this.$t("turnover.tooltip"),
      },
      {
        ...this.rorItems[this.rorIndex],
        icon: "$IconSwitcher",
        titleFn: () => {
          this.rorIndex = (this.rorIndex + 1) % 3;
        },
        hint: this.$t("ror.tooltip"),
      },
      {
        title: this.$t("24h.price-change"),
        value: priceChangeText,
      },
    ];

    return {
      items,
    };
  }

  handleClick() {
    this.$router.push({
      name: "swap",
      query: {
        input: this.pair?.base_asset_id,
        output: this.pair.quote_asset_id,
      },
    });
  }
}
export default PairInformations;
</script>

<style lang="scss" scoped>
.action {
  background: var(--v-greyscale_6-base);
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
</style>
