<template>
  <div :class="classes">
    <v-row class="ma-0">
      <v-col
        v-for="(item, index) in items"
        :key="index"
        cols="6"
        class="text-center py-4 px-0"
      >
        <div class="label mb-4">
          {{ item.text }}
        </div>
        <div class="value number">
          <base-fiat-division :parts="item.value" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GlobalGetters } from "~/store/types";

@Component
class PoolOverview extends Vue {
  get meta() {
    const overview = this.$store.getters[GlobalGetters.POOL_OVERVIEW];
    const toFiat = this.$utils.currency.toFiat;

    return {
      liquidity: toFiat(this, { n: overview.totalUSDValue, short: true }, true),
      volume: toFiat(this, { n: overview.volume24h, short: true }, true),
    };
  }

  get items() {
    return [
      {
        text: this.$t("liquidity.total"),
        value: this.meta.liquidity,
      },
      {
        text: this.$t("volume.global.24h"),
        value: this.meta.volume,
      },
    ];
  }

  get classes() {
    return {
      rounded: true,
      overview: true,
      "overview--lake": this.$config.CHANNEL === "lake",
    };
  }

  handleToAddLiquidity() {
    const pair = this.$utils.pair.getMostLiquidityPair(this);

    this.$router.push({
      name: "liquidity-add",
      query: { base: pair.base_asset_id, quote: pair.quote_asset_id },
    });
  }
}
export default PoolOverview;
</script>

<style lang="scss" scoped>
.overview {
  background: #22306d;

  &--lake {
    background: #3154d0;

    .label {
      color: #b2defd;
    }
  }
}

.label {
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
  color: #fd8cc2;
}

.value {
  font-size: 25px;
  font-weight: 700;
  color: #ffffff;
}

.f-divider {
  border-color: var(--v-secondary-base) !important;
}

::v-deep {
  .symbol {
    font-size: 16px;
  }
}
</style>
