<template>
  <div>
    <div>
      <transaction-filter v-model="type" />
    </div>

    <my-transactions :type="type" :pair="pair" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import TransactionFilter from "@/components/transaction/TransactionFilter.vue";
import MyTransactions from "@/components/transaction/MyTransactions.vue";
import { GlobalGetters } from "@/store/types";

@Component({
  components: {
    TransactionFilter,
    MyTransactions,
  },
})
class HistoryPage extends Mixins(mixins.page) {
  type = "";

  get title() {
    return this.$t("my.history");
  }

  get pair() {
    const getPairByIds = this.$store.getters[GlobalGetters.GET_PAIR_BY_IDS];
    const base = this.$route.query.base;
    const quote = this.$route.query.quote;

    return getPairByIds(base, quote);
  }
}
export default HistoryPage;
</script>
