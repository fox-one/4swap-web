<template>
  <div>
    <v-layout class="label-1 mb-4">
      <span>{{ $t("liquidity.remove") }}</span>

      <v-spacer />

      <slippage-setting :value="slippage" @change="handleSlippageChange" />
    </v-layout>

    <remove-form :data.sync="asset" :pair="pair">
      <template #information>
        <remove-form-informations :pair="pair" :data.sync="asset" />
      </template>

      <template #action="{ valid }">
        <remove-action :valid="valid" :pair="pair" :data="asset" />
      </template>
    </remove-form>

    <f-divider class="mt-6 mx-n4" />

    <introductions class="mt-4" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixin from "@/mixins";
import { Sync } from "vuex-pathify";
import { GlobalGetters, GlobalMutations } from "@/store/types";
import RemoveForm from "@/components/liquidity/RemoveForm.vue";
import RemoveFormInformations from "@/components/liquidity/RemoveFormInformations.vue";
import RemoveAction from "@/components/liquidity/RemoveAction.vue";
import Introductions from "@/components/particles/Introductions.vue";
import SlippageSetting from "@/components/swap/SlippageSetting.vue";

@Component({
  components: {
    RemoveForm,
    RemoveFormInformations,
    RemoveAction,
    Introductions,
    SlippageSetting,
  },
})
class LiquidityRemove extends Mixins(mixin.page) {
  @Sync("app/settings@slippage_remove") slippage;

  asset: any = {
    asset: null,
    amount: "",
  };

  get title() {
    return this.$t("liquidity.remove");
  }

  get appbar() {
    return {
      title: this.$t("liquidity.remove"),
    };
  }

  get pair() {
    const getPairByLiquidityId =
      this.$store.getters[GlobalGetters.GET_PAIR_BY_LIQUIDIY_ID];

    return getPairByLiquidityId(this.asset.asset?.id ?? "");
  }

  mounted() {
    this.setInitialAsset();
  }

  handleSlippageChange(value) {
    this.$store.commit(GlobalMutations.SET_SETTINGS, {
      slippage_remove: value,
    });
  }

  setInitialAsset() {
    const liquidityAssetId = this.$route.query.liquidity_asset;
    const getAssetById = this.$store.getters[GlobalGetters.GET_ASSET_BY_ID];

    this.asset.asset = getAssetById(liquidityAssetId) || null;
  }
}
export default LiquidityRemove;
</script>
