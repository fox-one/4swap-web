<template>
  <div v-if="asset">
    <base-information-list :items="items1" />
    <base-information-list reactive :items="items2" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
class AssetInformations extends Vue {
  @Prop() asset;

  @Prop() info;

  @Prop() pairs;

  get meta() {
    const format = this.$utils.number.format;
    const toFiat = this.$utils.currency.toFiat;
    const simplize = this.$utils.number.simplize;

    const total = this.info?.total ?? 0;
    const totalText = (total && format({ n: total })) || "-";

    const price = this.asset?.price ?? 0;
    const priceText = toFiat(this, { n: price });

    const circulation = this.info?.circulation ?? "";

    const marketCap = circulation * price;
    const marketCapText = toFiat(this, { n: marketCap });

    const [liquidity, volume, trades] = this.pairs.reduce(
      (prev, curr) => {
        const amount =
          curr.base_asset_id === this.asset?.id
            ? +curr.base_amount
            : +curr.quote_amount;
        const volume = +(curr.volume_24h ?? 0);
        const count = +(curr.transaction_count_24h ?? 0);
        return [prev[0] + amount, prev[1] + volume, prev[2] + count];
      },
      [0, 0, 0]
    );

    const liquidityText = simplize(this, { n: liquidity });
    const volumeText = simplize(this, { n: volume });
    const tradeText = format({ n: trades });

    const issueTime = this.info?.issue ?? "-";

    return {
      total,
      totalText,
      price,
      priceText,
      marketCap,
      marketCapText,
      circulation,
      liquidity,
      liquidityText,
      volume,
      volumeText,
      trades,
      tradeText,
      issueTime,
      website: this.info?.website ?? "",
    };
  }

  get items1() {
    const h = this.$createElement;
    const website = this.meta.website;

    return [
      website && {
        title: this.$t("website"),
        value: h(
          "a",
          {
            staticClass: "text-truncate secondary--text",
            domProps: {
              href: this.meta.website,
            },
          },
          [this.meta.website]
        ),
      },
    ];
  }

  get items2() {
    const {
      totalText,
      priceText,
      marketCapText,
      liquidityText,
      volumeText,
      tradeText,
      issueTime,
    } = this.meta;

    return [
      {
        title: this.$t("statistic.coin.total.supply"),
        value: totalText,
      },
      {
        title: this.$t("statistic.coin.market.cap"),
        value: marketCapText,
      },
      {
        title: this.$t("statistic.coin.liquidity"),
        value: liquidityText,
      },
      {
        title: this.$t("price.24hours"),
        value: priceText,
      },
      {
        title: this.$t("volume.24hours"),
        value: volumeText,
      },
      {
        title: this.$t("trades.24hours"),
        value: tradeText,
      },
      {
        title: this.$t("statistic.coin.issue.time"),
        value: issueTime,
      },
    ];
  }
}
export default AssetInformations;
</script>