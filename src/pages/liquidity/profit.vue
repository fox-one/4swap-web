<template>
  <v-container class="pa-0" style="padding-bottom: 97px !important">
    <profits-info-panel
      v-if="meta.pair"
      :pair="meta.pair"
      :profits="profits"
      expand-disabled
    />
    <div class="px-4">
      <profits-chart-panel
        :base-asset="meta.baseAsset"
        :quote-asset="meta.quoteAsset"
        :defaultDuration="$route.query.duration"
      />
    </div>
    <profits-actions
      :base-asset="meta.baseAsset"
      :quote-asset="meta.quoteAsset"
    />
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { ITransaction } from "~/services/types/vo";
import mixins from "@/mixins";
import { Getter } from "vuex-class";
import LiqHistoryItem from "@/components/particles/liquidity/LiqHistoryItem.vue";
import ProfitsActions from "@/components/particles/liquidity/ProfitsActions.vue";
import ProfitsInfoPanel from "@/components/particles/liquidity/ProfitsInfoPanel.vue";
import ProfitsChartPanel from "@/components/particles/liquidity/ProfitsChartPanel.vue";

@Component({
  components: {
    LiqHistoryItem,
    ProfitsActions,
    ProfitsInfoPanel,
    ProfitsChartPanel,
  },
})
class LiquidityHistory extends Mixins(mixins.page) {
  @Getter("global/getAssetById") getAssetById;

  @Getter("global/getPair") getPair;

  loading = false;

  transactions: ITransaction[] = [];

  profits: API.PairProfits | null = null;

  pagination = {
    hasNext: true,
    nextCursor: "",
  };

  get htmlTitle() {
    return this.$t("profit") as string;
  }

  get title() {
    return this.$createElement("base-pair-icon", {
      staticStyle: {
        "justify-content": "center",
      },
      props: {
        "base-asset": this.meta.baseAsset,
        "quote-asset": this.meta.quoteAsset,
        small: true,
      },
    }) as any;
  }

  get base() {
    return this.$route.query.base;
  }

  get quote() {
    return this.$route.query.quote;
  }

  get meta() {
    let baseAsset = this.getAssetById(this.base);
    let quoteAsset = this.getAssetById(this.quote);
    const reverse = this.transactions?.[0]?.quote_asset_id === this.base;
    if (reverse) {
      [baseAsset, quoteAsset] = [quoteAsset, baseAsset];
    }
    const pair = this.$store.getters["global/getPair"]({
      base: baseAsset.id,
      quote: quoteAsset.id,
    });

    return {
      pair,
      baseAsset,
      quoteAsset,
    };
  }

  mounted() {
    this.requestProfitData();
  }

  async requestProfitData() {
    try {
      const base = this.meta.baseAsset.id;
      const quote = this.meta.quoteAsset.id;
      const pair = this.getPair({ base, quote });
      const profits = await this.$http.getProfits(pair, { base, quote });
      this.profits = profits;
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
  }
}
export default LiquidityHistory;
</script>
