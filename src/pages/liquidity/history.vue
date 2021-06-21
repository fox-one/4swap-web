<template>
  <v-container class="pa-0">
    <liq-history-info-panel
      v-if="meta.pair"
      :pair="meta.pair"
      :profits="profits"
      expand-disabled
    />
    <div class="mt-5 px-4">
      <div class="f-greyscale-1 f-title-1 mb-4">
        {{ $t("history") }}
      </div>
      <f-panel
        v-infinite-scroll="requestTransaction"
        infinite-scroll-distance="10"
        padding="0"
        class="px-4"
      >
        <template v-for="(item, index) in transactions">
          <div :key="index" style="overflow: hidden">
            <liq-history-item
              timeFormat="absolute"
              :base-asset="meta.baseAsset"
              :quote-asset="meta.quoteAsset"
              :base-asset-symbol="meta.baseAssetSymbol"
              :quote-asset-symbol="meta.quoteAssetSymbol"
              :transaction="item"
            />
          </div>
        </template>
        <f-loading v-if="loading" :loading="loading" />
        <template v-else-if="transactions.length === 0">
          <base-empty-section />
        </template>
      </f-panel>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { Getter } from "vuex-class";
import LiqHistoryItem from "@/components/particles/liquidity/LiqHistoryItem.vue";
import LiqHistoryInfoPanel from "@/components/particles/liquidity/LiqHistoryInfoPanel.vue";

@Component({
  components: {
    LiqHistoryInfoPanel,
    LiqHistoryItem,
  },
})
class LiquidityHistory extends Mixins(mixins.page) {
  @Getter("global/getAssetById") getAssetById;

  @Getter("global/getPair") getPair;

  loading = false;

  transactions: API.Transaction[] = [];

  profits: API.PairProfits | null = null;

  pagination = {
    hasNext: true,
    nextCursor: "",
  };

  get appbar() {
    return {
      align: "center",
    };
  }

  get title() {
    return this.$t("history") as string;
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

  async requestTransaction() {
    if (this.loading || !this.pagination.hasNext) {
      return;
    }
    this.loading = true;
    try {
      const res = await this.$http.getMyTransactions({
        base: this.base,
        quote: this.quote,
        type: "add,remove",
        limit: 20,
        cursor: this.pagination.nextCursor,
      });
      const transactions = res.transactions || [];
      this.transactions = [...this.transactions, ...transactions];
      this.pagination.hasNext = res.pagination.has_next;
      this.pagination.nextCursor = res.pagination.next_cursor;
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
    this.loading = false;
  }
}
export default LiquidityHistory;
</script>
