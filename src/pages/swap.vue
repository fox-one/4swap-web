<template>
  <v-container>
    <v-layout class="label-1">
      <span>{{ $t("swap") }}</span>

      <v-spacer />

      <slippage-setting />
    </v-layout>

    <swap-form
      :input.sync="input"
      :output.sync="output"
      class="mt-4"
      @update:order="handleUpdateOrder"
    />
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { GlobalGetters, GlobalMutations } from "@/store/types";
import { Sync } from "vuex-pathify";
import SwapForm from "@/components/swap/SwapForm.vue";
import SlippageSetting from "@/components/swap/SlippageSetting.vue";
import { DEFAULT_ASSET_ID, BTC_ASSET_ID } from "@/constants";

@Component({
  components: {
    SwapForm,
    SlippageSetting,
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
    const pairMeta = getPairMeta(this, this.pair);
    const { symbol } = pairMeta;

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
    console.log(this.$store);
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
      .catch((e) => console.log(e));
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
