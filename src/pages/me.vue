<template>
  <div>
    <div v-if="!meta.logged" class="text-center">
      <base-connect v-if="!meta.logged" />
    </div>

    <liquidity-empty-placeholder v-else-if="meta.empty" />

    <template v-else>
      <account-overview />

      <f-divider class="mx-n4 my-8" />

      <div class="label-1 mb-4">{{ $t("my.pools") }}</div>

      <f-search-input
        v-model="filter"
        :placeholder="$t('search.pools')"
        hide-details
      />

      <account-pool-list :filter="filter" class="mt-4" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { GlobalGetters } from "@/store/types";
import LiquidityEmptyPlaceholder from "@/components/account/LiquidityEmptyPlaceholder.vue";
import AccountOverview from "@/components/account/AccountOverview.vue";
import AccountPoolList from "@/components/account/PoolList.vue";

@Component({
  components: {
    LiquidityEmptyPlaceholder,
    AccountOverview,
    AccountPoolList,
  },
})
class MePage extends Mixins(mixins.page) {
  filter = "";

  get htmlTitle() {
    return this.$t("me") as string;
  }

  get appbar() {
    return {
      show: true,
      back: false,
      style: "home",
    };
  }

  get bottomNav() {
    return "me";
  }

  get meta() {
    const logged = this.$store.getters[GlobalGetters.LOGGED];
    const pairs = this.$store.getters[GlobalGetters.ACCOUNT_PAIRS](this);
    const empty = pairs.length === 0;

    return {
      empty,
      logged,
      pairs,
    };
  }
}
export default MePage;
</script>
