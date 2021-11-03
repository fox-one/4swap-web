<template>
  <div :class="classes">
    <v-row class="ma-0">
      <v-col
        v-for="(item, index) in items"
        :key="index"
        cols="6"
        class="text-center pa-4"
      >
        <div class="label-3 mb-4">
          {{ item.text }}
        </div>
        <div class="value number">
          <base-fiat-division :parts="item.value" />
        </div>
      </v-col>
    </v-row>

    <f-divider opacity="0.1" />

    <div class="pa-4 text-center">
      <f-button text small color="secondary" @click="handleToAddLiquidity">
        <v-icon size="16" class="mr-1">$FIconAdd4P</v-icon>
        <span>{{ $t("liquidity.add") }}</span>
      </f-button>
    </div>
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
    this.$router.push({ name: "liquidity-add" });
  }
}
export default PoolOverview;
</script>

<style lang="scss" scoped>
.overview {
  background: linear-gradient(180deg, #85263d 0%, #88305a 100%);

  &--lake {
    background: linear-gradient(180deg, #0e4b77 0%, #075973 100%);
  }
}

.theme--light {
  .overview {
    background: linear-gradient(180deg, #fff6f5 0%, #fdf4f8 100%);

    &--lake {
      background: linear-gradient(
        180deg,
        #e0f8ff 0%,
        #edfbfc 100%,
        #edfbfc 100%
      );
    }
  }
}

.value {
  font-size: 25px;
  font-weight: 700;
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
