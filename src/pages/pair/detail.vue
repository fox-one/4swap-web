<template>
  <div v-if="meta.pair" class="page">
    <account-panel v-show="tabIndex === 0" :pair="meta.pair" />
    <market-panel v-show="tabIndex === 1" :pair="meta.pair" />
    <page-bottom-action :added="meta.isAdded" :pair="meta.pair" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { GlobalGetters } from "@/store/types";
import MarketPanel from "@/components/pair/MarketPanel.vue";
import AccountPanel from "@/components/pair/AccountPanel.vue";
import PageBottomAction from "@/components/pair/page-bottom-action/Index.vue";
import PageTabs from "@/components/pair/PageTabs.vue";
import { Sync } from "vuex-pathify";

@Component({
  components: {
    MarketPanel,
    AccountPanel,
    PageBottomAction,
  },
})
class PairDetailPage extends Mixins(mixins.page) {
  @Sync("page/pairDetail@tabIndex") tabIndex!: number;

  get title() {
    return this.meta.symbol;
  }

  get appbar() {
    if (this.meta.isAdded) {
      return {
        align: "center",
        extensionHight: 56,
        extension: this.$createElement(PageTabs),
      };
    }

    return { align: "center" };
  }

  get meta() {
    const getters = this.$store.getters;
    const getPair = getters[GlobalGetters.GET_PAIR_BY_IDS];
    const getIsLiquidityAdded = getters[GlobalGetters.GET_IS_LIQUIDITY_ADDED];
    const getPairMeta = this.$utils.pair.getPairMeta;

    const id1 = this.$route.query.base;
    const id2 = this.$route.query.quote;
    const pair = getPair(id1, id2);
    const pairMeta = getPairMeta(this, pair);
    const isAdded = getIsLiquidityAdded(pair);

    return { pair, symbol: pairMeta?.symbol ?? "", isAdded };
  }

  @Watch("meta.pair", { immediate: true })
  handlePairChange() {
    this.setPageConfig();
  }
}
export default PairDetailPage;
</script>

<style lang="scss" scoped>
.page {
  padding-bottom: 160px;
}
</style>
