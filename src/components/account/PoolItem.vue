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

    <pool-item-informations :pair="pair" class="mt-6" />

    <div class="share-text">
      {{ meta.shareText }}

      <base-mvm-action :asset="meta.liquidityAsset" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { AccountPair } from "@/utils/pair/helper";
import PoolItemInformations from "./PoolItemInformations.vue";
import { GlobalActions } from "@/store/types";

@Component({
  components: {
    PoolItemInformations,
  },
})
class PoolItem extends Vue {
  @Prop() pair!: AccountPair;

  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const getPairMeta = this.$utils.pair.getPairMeta;
    const format = this.$utils.number.format;
    const pairMeta = getPairMeta(this, this.pair);

    const { shared } = this.pair;
    const { liquidityAsset, baseAsset, quoteAsset, symbol } = pairMeta || {};

    const totalValue = shared?.totalValue ?? 0;
    const totalValuetext = toFiat(this, { n: totalValue });
    const shareText =
      format({ n: shared?.balance ?? "" }) + " " + liquidityAsset?.symbol ?? "";

    return {
      baseAsset,
      quoteAsset,
      liquidityAsset,
      totalValuetext,
      shareText,
      symbol,
      sharedText: "",
    };
  }

  mounted() {
    const { base_asset_id, quote_asset_id } = this.pair;

    this.$store.dispatch(GlobalActions.LOAD_PROFIT, {
      base: base_asset_id,
      quote: quote_asset_id,
    });
  }

  handleToDetail() {
    this.$router.push({
      name: "pair-detail",
      query: {
        base: this.pair.base_asset_id,
        quote: this.pair.quote_asset_id,
        source: "profile",
      },
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

.share-text {
  display: flex;
  font-size: 12px;
  font-weight: 500;
  margin-top: 24px;
  color: var(--v-greyscale_4-base);
}
</style>
