<template>
  <div>
    <v-layout class="label-1 mb-4">
      <span>{{ $t("liquidity.add") }}</span>

      <v-spacer />

      <slippage-setting :value="slippage" @change="handleSlippageChange" />
    </v-layout>

    <first-liquidity-provider-tip :pair="pair" />

    <add-form :asset1.sync="asset1" :asset2.sync="asset2" :pair="pair">
      <template #information>
        <add-form-informations :asset1="asset1" :asset2="asset2" :pair="pair" />
      </template>

      <template #action="{ valid }">
        <add-action
          :asset1="asset1"
          :asset2="asset2"
          :pair="pair"
          :valid="valid"
        />
      </template>
    </add-form>

    <f-divider class="mt-6 mx-n4" />

    <introductions class="mt-4" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixin from "@/mixins";
import { GlobalGetters, GlobalMutations } from "@/store/types";
import { Sync } from "vuex-pathify";
import AddForm from "@/components/liquidity/AddForm.vue";
import AddFormInformations from "@/components/liquidity/AddFormInformations.vue";
import AddAction from "@/components/liquidity/AddAction.vue";
import Introductions from "@/components/particles/Introductions.vue";
import FirstLiquidityProviderTip from "@/components/liquidity/FirstLiquidityProviderTip.vue";
import SlippageSetting from "@/components/swap/SlippageSetting.vue";

import type { Asset } from "@/utils/assets";

type AssetData = {
  asset: Asset | null;
  amount: string;
};

@Component({
  components: {
    AddForm,
    AddFormInformations,
    AddAction,
    Introductions,
    FirstLiquidityProviderTip,
    SlippageSetting,
  },
})
class LiquidityAdd extends Mixins(mixin.page) {
  @Sync("app/settings@slippage_add") slippage;

  asset1: AssetData = {
    asset: null,
    amount: "",
  };

  asset2: AssetData = {
    asset: null,
    amount: "",
  };

  get title() {
    return "";
  }

  get appbar() {
    return {
      title: this.$t("liquidity.add"),
    };
  }

  get pair() {
    const getPairByIds = this.$store.getters[GlobalGetters.GET_PAIR_BY_IDS];

    return getPairByIds(
      this.asset1.asset?.id ?? "",
      this.asset2.asset?.id ?? ""
    );
  }

  @Watch("asset1.asset")
  @Watch("asset2.asset")
  handleAssetChange() {
    this.$router
      .replace({
        query: {
          base: this.asset1.asset?.id,
          quote: this.asset2.asset?.id,
        },
      })
      .catch(() => {
        // ignore
      });
  }

  mounted() {
    this.setInitialAsset();
  }

  handleSlippageChange(value) {
    this.$store.commit(GlobalMutations.SET_SETTINGS, { slippage_add: value });
  }

  setInitialAsset() {
    const base = this.$route.query.base;
    const quote = this.$route.query.quote;
    const getAssetById = this.$store.getters[GlobalGetters.GET_ASSET_BY_ID];

    const asset1 = getAssetById(base) || null;
    const asset2 = getAssetById(quote) || null;

    this.asset1.asset = asset1;
    this.asset2.asset = asset2;
  }
}
export default LiquidityAdd;
</script>
