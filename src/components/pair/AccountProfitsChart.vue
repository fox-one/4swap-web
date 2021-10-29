<template>
  <div>
    <profit-chart-panel :loading="loading" :pair="pair" :data="formatedData" />

    <profit-rate-chart-panel
      :loading="loading"
      :pair="pair"
      :data="formatedData"
      class="mt-4"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { fmtProfits } from "@/utils/profits";
import ProfitChartPanel from "@/components/chart/profit-chart/ProfitChartPanel.vue";
import ProfitRateChartPanel from "@/components/chart/profit-rate-chart/ProfitRateChartPanel.vue";

@Component({
  components: {
    ProfitChartPanel,
    ProfitRateChartPanel,
  },
})
class AccountProfitChart extends Vue {
  @Prop() pair;

  loading = false;

  data: API.ProfitsData[] = [];

  get formatedData() {
    return this.data.map((x) => fmtProfits(this.pair, x));
  }

  mounted() {
    this.requestProfitsHistory();
  }

  async requestProfitsHistory() {
    this.loading = true;

    try {
      const base = this.pair?.base_asset_id ?? "";
      const quote = this.pair?.quote_asset_id ?? "";
      const res = await this.$http.getProfitsHistory({
        base,
        quote,
        dur: "4320h",
      });

      this.data = res;
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
    this.loading = false;
  }
}
export default AccountProfitChart;
</script>
