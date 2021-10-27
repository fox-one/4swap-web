<template>
  <div>
    <create-form :asset1.sync="asset1" :asset2.sync="asset2" :pair="pair">
      <template #action="{ valid }">
        <create-action :valid="valid" />
      </template>
    </create-form>

    <f-divider class="mt-6 mb-8 mx-n4" />
    <create-pool-rules />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { GlobalGetters } from "@/store/types";
import CreateForm from "@/components/liquidity/CreateForm.vue";
import CreateAction from "@/components/liquidity/CreateAction.vue";
import CreatePoolRules from "@/components/particles/CreatePoolRules.vue";

@Component({
  components: {
    CreateForm,
    CreateAction,
    CreatePoolRules,
  },
})
class CreatePoolPage extends Mixins(mixins.page) {
  asset1: API.Asset | null = null;

  asset2: API.Asset | null = null;

  get title() {
    return this.$t("liquidity.create.title");
  }

  get appbar() {
    return {
      title: this.$t("liquidity.create.title"),
    };
  }

  get pair() {
    const getPairByIds = this.$store.getters[GlobalGetters.GET_PAIR_BY_IDS];

    return getPairByIds(this.asset1?.id, this.asset2?.id);
  }

  mounted() {
    this.setInitialAsset();
  }

  setInitialAsset() {
    const base = this.$route.query.base;
    const quote = this.$route.query.quote;

    const getAssetById = this.$store.getters[GlobalGetters.GET_ASSET_BY_ID];

    this.asset1 = getAssetById(base) || null;
    this.asset2 = getAssetById(quote) || null;
  }
}
export default CreatePoolPage;
</script>
