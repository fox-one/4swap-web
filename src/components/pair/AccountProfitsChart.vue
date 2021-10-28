<template>
  <div>
    <profit-chart-panel :loading="loading" :pair="pair" :data="formatedData" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { fmtProfits } from "@/utils/profits";
import ProfitChartPanel from "@/components/chart/profit-chart/ProfitChartPanel.vue";

@Component({
  components: {
    ProfitChartPanel,
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
