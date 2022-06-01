<template>
  <div>
    <v-expand-transition>
      <base-information-list :items="meta.items" small />
    </v-expand-transition>

    <div class="mt-n3">
      <div class="expand-action">
        <v-icon
          color="greyscale_3"
          :size="16"
          :class="{ 'expand-icon--active': expand }"
          class="expand-icon"
          @click="handleToggle"
        >
          $FIconChevronDown4P
        </v-icon>
      </div>

      <f-divider class="my-3" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Sync } from "vuex-pathify";

@Component
class PairInformations extends Vue {
  @Prop() pair!: API.Pair;

  @Prop() data;

  @Sync("page/pairDetail@pair_information_expand") expand;

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
    const { volume, volume_24h, transaction_count_24h, fee_24h, turnOver } =
      getPairMeta(this, this.pair)!;

    const items: any[] = [
      {
        title: this.$t("24h.vol"),
        value: toFiat(this, { n: volume_24h, short: true }),
      },
      {
        title: this.$t("24h.pool-turnover"),
        value: toPercent({ n: turnOver }),
        hint: this.$t("turnover.tooltip"),
      },
      {
        title: this.$t("liquidity"),
        value: toFiat(this, { n: volume, short: true }),
      },
    ];

    if (this.expand) {
      items.push(
        "divider",
        ...this.rorItems,
        "divider",
        {
          title: this.$t("24h.trades"),
          value: transaction_count_24h ?? "0",
        },
        {
          title: this.$t("24h.fees"),
          value: toFiat(this, { n: fee_24h }),
        }
      );
    }

    return {
      items,
    };
  }

  handleToggle() {
    this.expand = !this.expand;
  }
}
export default PairInformations;
</script>

<style lang="scss" scoped>
.expand-action {
  text-align: center;
}

.expand-icon--active {
  transform: rotate(180deg);
  transition: 0.2s ease;
}
</style>
