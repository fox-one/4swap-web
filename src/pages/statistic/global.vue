<template>
  <v-container class="pa-0">
    <f-panel class="no-border-radius pa-0 pt-4 pb-3">
      <f-info-grid :window-size="3">
        <f-info-grid-item
          v-for="(item, ix) in pannelData"
          :key="ix"
          :index="ix"
          :title="item.title"
          :value="item.value"
          :value-unit="item.valueUnit"
          :value-custom-color="item.valueCustomColor"
          :hint="item.hint"
        />
      </f-info-grid>
    </f-panel>

    <chart-panel defaultDuration="720h" defaultChartType="volume" />
    <div class="mt-5 px-4">
      <div class="f-greyscale-1 f-title-1 mb-4">
        {{ $t("history") }}
      </div>
      <f-panel
        v-infinite-scroll="requestTransactions"
        infinite-scroll-distance="10"
      >
        <template v-for="(item, index) in transactions">
          <div :key="index" style="overflow: hidden">
            <liq-history-item :transaction="item" />
          </div>
        </template>
        <f-loading
          v-if="loading"
          :loading="loading"
          size="24"
          width="2"
          class="pa-5"
        />
      </f-panel>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import BigNumber from "bignumber.js";
import { State } from "vuex-class";
import LiqHistoryItem from "@/components/particles/liquidity/LiqHistoryItem.vue";
import ChartPanel from "@/components/particles/pair-info/ChartsPanel.vue";

@Component({
  components: {
    LiqHistoryItem,
    ChartPanel,
  },
})
class GlobalStatistic extends Mixins(mixins.page) {
  @State((state) => state.app.settings) settings;

  loading = false;

  transactions: API.Transaction[] = [];

  pagination = {
    hasNext: true,
    nextCursor: "",
  };

  get pannelData() {
    const currencySymbol = this.settings.currency;
    return [
      {
        title: this.$t("liquidity.fiat", { symbol: currencySymbol }),
        value: this.meta.totalText,
      },
      {
        title: this.$t("volume.24hours"),
        value: this.meta.volumeText,
      },
      {
        title: this.$t("trades.24hours"),
        value: this.meta.trades,
      },
      {
        title: this.$t("fees.24hours"),
        value: this.meta.feeText,
      },
      {
        title: this.$t("pool_turnover.24hours"),
        value: this.meta.poolTurnoverText,
      },
    ];
  }

  get title() {
    return this.$t("statistic") as string;
  }

  get appbar() {
    return {
      align: "center",
    };
  }

  get meta() {
    const formatNumber = this.$utils.number.format;
    const pairs = this.$store.getters["global/getAvaliablePairs"];

    const { totalUSDValue, volume24h, fee24h, transactions } = pairs.reduce(
      ({ totalUSDValue, volume24h, fee24h, transactions }, p) => {
        return {
          totalUSDValue: totalUSDValue.plus(p.base_value).plus(p.quote_value),
          volume24h: volume24h.plus(p.volume_24h),
          fee24h: fee24h.plus(p.fee_24h),
          transactions: transactions.plus(p.transaction_count_24h ?? 0),
        };
      },
      {
        totalUSDValue: new BigNumber(0),
        volume24h: new BigNumber(0),
        fee24h: new BigNumber(0),
        transactions: new BigNumber(0),
      }
    );

    const totalText = this.formatFiat(totalUSDValue);
    const volumeText = this.formatFiat(volume24h);
    const feeText = this.formatFiat(fee24h);

    const poolTurnover = new BigNumber(volume24h)
      .div(totalUSDValue)
      .multipliedBy(100);
    const poolTurnoverText = `${poolTurnover.toFixed(2)}%`;

    const trades = formatNumber({
      n: transactions,
      p: 0,
    });

    return {
      totalText,
      volumeText,
      feeText,
      poolTurnoverText,
      trades,
    };
  }

  mounted() {
    this.requestTransactions();
  }

  async requestTransactions() {
    if (this.loading || !this.pagination.hasNext) {
      return;
    }
    this.loading = true;
    try {
      const res = await this.$http.getGloabalTransactions({
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

  formatFiat(amountUsd, fraction = -1) {
    return this.$utils.number.formatFiat.call(this, this, amountUsd, fraction);
  }
}
export default GlobalStatistic;
</script>
