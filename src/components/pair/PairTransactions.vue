<template>
  <base-list-warpper
    :data="transactions"
    :error="error"
    :loading="loading"
    @load="requstTransactions"
  >
    <transaction-item
      v-for="(item, index) in transactions"
      :key="index"
      :transaction="item"
    />
  </base-list-warpper>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import TransactionItem from "@/components/transaction/Index.vue";

@Component({
  components: {
    TransactionItem,
  },
})
class PairTransactions extends Vue {
  @Prop() pair!: API.Pair;

  loading = false;

  error = false;

  pagination = {
    has_next: true,
    next_cursor: "",
  };

  transactions: API.Transaction[] = [
    {
      base_amount: "1",
      base_asset_id: "31d2ea9c-95eb-3355-b65b-ba096853bc18",
      created_at: "2021-10-20T09:17:42Z",
      fee_amount: "0",
      fee_value: "0",
      follow_id: "b5e374e7-52f8-41ac-ac84-c5dc543d66d1",
      id: "8b6f27cf-ebe9-3b04-b120-b735b967985a",
      liquidity: "0.39485338",
      quote_amount: "0.22203662",
      quote_asset_id: "6cfe566e-4aad-470b-8c9a-2fd35b49c68d",
      type: "Add",
      value: "2",
    } as any,
  ];

  async requstTransactions() {
    if (this.loading || !this.pagination.has_next) {
      return;
    }

    this.loading = true;

    try {
      const res = await this.$http.getTransactions({
        base: this.pair.base_asset_id,
        quote: this.pair.quote_asset_id,
        limit: 20,
        cursor: this.pagination.next_cursor,
      });

      const transactions = res.transactions || [];
      this.transactions = [...this.transactions, ...transactions];
      this.pagination.has_next = res.pagination.has_next;
      this.pagination.next_cursor = res.pagination.next_cursor;
      this.loading = false;
    } catch (error) {
      this.error = true;
      this.loading = false;
    }
  }
}
export default PairTransactions;
</script>
