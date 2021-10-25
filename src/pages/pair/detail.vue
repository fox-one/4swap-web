<template>
  <div v-if="meta.pair">
    <pair-price :pair="meta.pair" />

    <f-divider class="my-6 mx-n3" />

    <pair-informations :pair="meta.pair" />

    <div class="label-1 mt-8">{{ $t("pool.added-assets") }}</div>
    <pair-assets :pair="meta.pair" class="mt-4" />

    <div class="label-1 mt-8">{{ $t("chart") }}</div>

    <div class="label-1 mt-8">{{ $t("transactions") }}</div>
    <pair-transactions :pair="meta.pair" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { GlobalGetters } from "@/store/types";
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
class PairDetailPage extends Mixins(mixins.page) {
  get title() {
    return this.meta.symbol;
  }

  get appbar() {
    return {
      align: "center",
    };
  }

  get meta() {
    const getPair = this.$store.getters[GlobalGetters.GET_PAIR_BY_IDS];
    const getPairMeta = this.$utils.pair.getPairMeta;
    const id1 = this.$route.query.base;
    const id2 = this.$route.query.quote;
    const pair = getPair(id1, id2);

    if (pair) {
      const { baseAsset, quoteAsset, symbol } = getPairMeta(this, pair);

      return { pair, baseAsset, quoteAsset, symbol };
    }

    return { pair };
  }

  @Watch("meta.pair", { immediate: true })
  handlePairChange() {
    this.setPageConfig();
  }
}
export default PairDetailPage;
</script>
