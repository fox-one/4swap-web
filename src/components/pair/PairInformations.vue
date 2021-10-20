<template>
  <div>
    <base-information-list :items="meta.items" reactive small />

    <div class="label-1 action rounded mt-6" @click="handleClick">
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

  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const toPercent = this.$utils.number.toPercent;
    const getPairMeta = this.$utils.pair.getPairMeta;
    const {
      volume,
      volume_24h,
      transaction_count_24h,
      fee_24h,
      turnOver,
    } = getPairMeta(this, this.pair);

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
        value: transaction_count_24h ?? 0,
      },
      {
        title: this.$t("24h.fees"),
        value: toFiat(this, { n: fee_24h }),
      },
      {
        title: this.$t("24h.pool-turnover"),
        value: toPercent({ n: turnOver }),
        icon: "$IconSwitcher",
        titleFn: () => {
          //
        },
        hint: "24H Pool Turnover",
      },
      {
        title: this.$t("24h.ror"),
        value: "",
        hint: "24H ROR",
      },
      {
        title: this.$t("24h.price-change"),
        value: "",
      },
    ];

    return {
      items,
    };
  }

  handleClick() {
    this.$router.push({ name: "swap" });
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
}
</style>
