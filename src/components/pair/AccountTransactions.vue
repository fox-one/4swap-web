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
class AccountTransactions extends Vue {
  @Prop() pair!: API.Pair;

  loading = false;

  error = false;

  pagination = {
    has_next: true,
    next_cursor: "",
  };

  transactions: API.Transaction[] = [];

  async requstTransactions() {
    if (this.loading || !this.pagination.has_next) {
      return;
    }

    this.loading = true;

    try {
      const res = await this.$http.getMyTransactions({
        base: this.pair.base_asset_id,
        quote: this.pair.quote_asset_id,
        limit: 20,
        cursor: this.pagination.next_cursor,
        type: "add,remove",
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
export default AccountTransactions;
</script>
