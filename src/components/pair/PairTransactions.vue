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
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import TransactionItem from "@/components/transaction/Index.vue";
import axios from "axios";

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

  transactions: API.Transaction[] = [];

  source: any = null;

  @Watch("pair.route_id")
  handlePairChange() {
    this.requstTransactions(true);
  }

  async requstTransactions(reload = false) {
    if (!reload && (this.loading || !this.pagination.has_next)) {
      return;
    }

    this.loading = true;

    try {
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      if (reload) {
        this.source?.cancel();
      }

      this.source = source;

      const res = await this.$http.getTransactions(
        {
          base: this.pair.base_asset_id,
          quote: this.pair.quote_asset_id,
          limit: 20,
          cursor: this.pagination.next_cursor,
        },
        source.token
      );

      const transactions = res.transactions || [];

      this.transactions = reload
        ? [...transactions]
        : [...this.transactions, ...transactions];

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
