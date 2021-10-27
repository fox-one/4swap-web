<template>
  <div>
    <market-informations />

    <f-divider class="my-8 mx-n4" />
    <div class="label-1 mt-8">{{ $t("chart") }}</div>

    <div class="label-1 mt-8">{{ $t("transactions") }}</div>
    <market-transactions />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import MarketInformations from "@/components/market/MarketInformations.vue";
import MarketTransactions from "@/components/market/MarketTransactions.vue";

@Component({
  components: {
    MarketInformations,
    MarketTransactions,
  },
})
class MarketPage extends Mixins(mixins.page) {
  get title() {
    return this.$t("overview") as string;
  }
}
export default MarketPage;
</script>
