<template>
  <div>
    <div class="f-greyscale-1 mt-10 mb-4 f-title-1">
      {{ $t("history") }}
    </div>
    <f-panel
      padding="0"
      class="transactions px-4"
      v-infinite-scroll="requstTransaction"
      infinite-scroll-distance="10"
    >
      <template v-for="(item, index) in transactions">
        <div :key="index" style="overflow: hidden">
          <liq-history-item :transaction="item" />
        </div>
      </template>
      <f-loading v-if="loading" size="24" width="2" class="pa-5" />
    </f-panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import LiqHistoryItem from "@/components/particles/liquidity/LiqHistoryItem.vue";

@Component({
  components: {
    LiqHistoryItem,
  },
})
class Transactions extends Vue {
  @Prop() pair!: API.Pair;

  @Prop() baseAsset!: API.Asset;

  @Prop() quoteAsset!: API.Asset;

  loading = false;

  transactions: API.Transaction[] = [];

  pagination = {
    has_next: true,
    next_cursor: "",
  };

  mounted() {
    this.requstTransaction();
  }

  async requstTransaction() {
    if (this.loading || !this.pagination.has_next) {
      return;
    }
    this.loading = true;
    try {
      const res = await this.$http.getTransactions({
        base: this.baseAsset?.id,
        quote: this.quoteAsset?.id,
        limit: 20,
        cursor: this.pagination.next_cursor,
      });
      const transactions = res.transactions || [];
      this.transactions = [...this.transactions, ...transactions];
      this.pagination.has_next = res.pagination.has_next;
      this.pagination.next_cursor = res.pagination.next_cursor;
      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }
}
export default Transactions;
</script>

<style lang="scss" scoped>
.transactions {
  margin-bottom: 160px;
}
</style>
