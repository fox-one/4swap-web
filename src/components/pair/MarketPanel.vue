<template>
  <div v-if="pair">
    <pair-price :pair="pair" />

    <f-divider class="my-6 mx-n3" />

    <pair-informations :pair="pair" />

    <div class="label-1 mt-8">{{ $t("pool.added-assets") }}</div>
    <pair-assets :pair="pair" class="mt-4" />

    <div class="label-1 mt-8">{{ $t("chart") }}</div>

    <div class="label-1 mt-8">{{ $t("transactions") }}</div>
    <pair-transactions :pair="pair" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PairPrice from "@/components/pair/PairPrice.vue";
import PairInformations from "@/components/pair/PairInformations.vue";
import PairAssets from "@/components/pair/PairAssets.vue";
import PairTransactions from "@/components/pair/PairTransactions.vue";

@Component({
  components: {
    PairPrice,
    PairAssets,
    PairInformations,
    PairTransactions,
  },
})
class MarketPanel extends Vue {
  @Prop() pair;
}
export default MarketPanel;
</script>
