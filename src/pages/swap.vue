<template>
  <div>
    <v-layout class="label-1">
      <span>{{ $t("swap") }}</span>

      <v-spacer />

      <slippage-setting />
    </v-layout>

    <swap-form
      :pair="pair"
      :order="order"
      :input.sync="input"
      :output.sync="output"
      class="mt-4"
      @update:order="handleUpdateOrder"
    />

    <template v-if="pair">
      <f-divider class="mt-6 mx-n4" />

      <div class="label-1 mt-8">{{ $t("assets.pool") }}</div>
      <pair-assets show-detail-link :pair="pair" class="mt-4" />

      <div class="label-1 mt-8">{{ $t("history") }}</div>
      <pair-transactions :pair="pair" class="mt-2" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import { GlobalGetters, GlobalMutations } from "@/store/types";
import { DEFAULT_ASSET_ID, BTC_ASSET_ID } from "@/constants";
import mixins from "@/mixins";
import { Sync } from "vuex-pathify";
import SwapForm from "@/components/swap/SwapForm.vue";
import SlippageSetting from "@/components/swap/SlippageSetting.vue";
import PairAssets from "@/components/pair/PairAssets.vue";
import PairTransactions from "@/components/pair/PairTransactions.vue";

@Component({
  components: {
    SwapForm,
    SlippageSetting,
    PairAssets,
    PairTransactions,
  },
  beforeRouteLeave(_to, _from, next) {
    (this as any).handleClearAmount();

    next();
  },
})
class SwapPage extends Mixins(mixins.page) {
  @Sync("page/swap@input") input!: State.SwapAssetData;

  @Sync("page/swap@output") output!: State.SwapAssetData;

  order: API.SwapOrder | null = null;

  get htmlTitle() {
    return this.$t("swap.symbol", { symbol: this.meta.symbol });
  }

  get appbar() {
    return {
      show: true,
      back: false,
      style: "home",
    };
  }

  get bottomNav() {
    return "swap";
  }

  get meta() {
    if (!this.pair) {
      return { symbol: "" };
    }

    const getPairMeta = this.$utils.pair.getPairMeta;
    const { symbol } = getPairMeta(this, this.pair)!;

    return {
      symbol,
    };
  }

  get pair() {
    const getPairByIds = this.$store.getters[GlobalGetters.GET_PAIR_BY_IDS];

    return getPairByIds(
      this.input.asset?.id ?? "",
      this.output.asset?.id ?? ""
    );
  }

  mounted() {
    this.setInitialAsset();
  }

  @Watch("asset1.asset")
  @Watch("asset2.asset")
  handleAssetChange(value) {
    this.setLRUCache(value);

    this.$router
      .replace({
        query: {
          input: this.input.asset?.id,
          output: this.output.asset?.id,
        },
      })
      .catch(() => {
        // ignore
      });
  }

  handleClearAmount() {
    this.input.amount = "";
    this.output.amount = "";
  }

  setInitialAsset() {
    const input =
      this.$route.query.input || this.input.asset?.id || DEFAULT_ASSET_ID;
    const output =
      this.$route.query.output || this.output.asset?.id || BTC_ASSET_ID;

    const getAssetById = this.$store.getters[GlobalGetters.GET_ASSET_BY_ID];

    this.input.asset = getAssetById(input) || null;
    this.output.asset = getAssetById(output) || null;
  }

  setLRUCache(value) {
    this.$store.commit(GlobalMutations.PUT_CACHE, value?.id);
  }

  handleUpdateOrder(order) {
    this.order = order;
  }
}
export default SwapPage;
</script>
