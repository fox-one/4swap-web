<template>
  <v-container>
    <liquidity-add-form
      :asset1.sync="asset1"
      :asset2.sync="asset2"
      :pair="pair"
      :order.sync="order"
    />

    <f-divider class="mt-6 mx-n4" />

    <introductions class="mt-4" />
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixin from "@/mixins";
import { GlobalGetters } from "@/store/types";
import LiquidityAddForm from "@/components/liquidity/AddForm.vue";
import Introductions from "@/components/particles/Introductions.vue";

import type { Asset } from "@/utils/assets";

type AssetData = {
  asset: Asset | null;
  amount: string;
};

@Component({
  components: {
    LiquidityAddForm,
    Introductions,
  },
})
class LiquidityAdd extends Mixins(mixin.page) {
  asset1: AssetData = {
    asset: null,
    amount: "",
  };

  asset2: AssetData = {
    asset: null,
    amount: "",
  };

  get title() {
    return this.$t("liquidity.add");
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
}
export default LiquidityAdd;
</script>
