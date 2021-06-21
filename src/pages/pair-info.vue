<template>
  <v-container class="pa-0">
    <f-loading v-if="loading" :loading="loading" fullscreen />
    <template v-else-if="pair">
      <base-info-panel
        :base-asset="meta.baseAsset"
        :quote-asset="meta.quoteAsset"
        :pair="pair"
        :assets="assets"
      />
      <charts-panel
        :base-asset="meta.baseAsset"
        :quote-asset="meta.quoteAsset"
        :defaultChartType="$route.query.type || 'volume'"
        :defaultDuration="$route.query.duration || '720h'"
      />
      <div class="px-4">
        <transactions
          :base-asset="meta.baseAsset"
          :quote-asset="meta.quoteAsset"
          :pair="pair"
        />
      </div>
      <pair-actions
        :base-asset="meta.baseAsset"
        :quote-asset="meta.quoteAsset"
      />
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { Getter, State } from "vuex-class";
import BaseInfoPanel from "@/components/particles/pair-info/BaseInfoPanel.vue";
import Transactions from "@/components/particles/pair-info/Transactions.vue";
import PairActions from "@/components/particles/pair-info/PairActions.vue";
import ChartsPanel from "@/components/particles/pair-info/ChartsPanel.vue";

@Component({
  components: {
    BaseInfoPanel,
    Transactions,
    PairActions,
    ChartsPanel,
  },
})
class PairInfoPage extends Mixins(mixins.page) {
  @Getter("global/getAssetById") getAssetById;

  @Getter("global/getPair") getPair;

  @State((state) => state.global.assets) assets;

  loading = false;

  get pair(): API.Pair | undefined {
    const base = this.$route.query.base;
    const quote = this.$route.query.quote;
    return this.getPair({ base, quote });
  }

  get appbar() {
    return {
      align: "center",
    };
  }

  get htmlTitle() {
    return this.meta.symbol;
  }

  get title() {
    return this.$createElement("base-pair-icon", {
      staticStyle: {
        "justify-content": "center",
      },
      props: {
        "base-asset": this.meta.baseAsset,
        "quote-asset": this.meta.quoteAsset,
        small: true,
      },
    }) as any;
  }

  get meta() {
    const baseAsset = this.getAssetById(this.pair?.base_asset_id);
    const quoteAsset = this.getAssetById(this.pair?.quote_asset_id);
    let symbol = `${baseAsset?.symbol ?? ""}-${quoteAsset?.symbol ?? ""}`;
    if (baseAsset && quoteAsset && baseAsset.symbol === quoteAsset.symbol) {
      symbol = `${baseAsset?.display_symbol ?? ""}-${
        quoteAsset?.display_symbol ?? ""
      }`;
    }
    return {
      quoteAsset,
      baseAsset,
      symbol,
    };
  }

  @Watch("pair")
  handlePairChange() {
    this.setPageConfig();
  }
}
export default PairInfoPage;
</script>
