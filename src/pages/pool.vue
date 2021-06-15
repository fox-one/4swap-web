<template>
  <div>
    <v-container class="pa-0">
      <f-panel class="no-border-radius page-top">
        <global-liquidity />
        <f-input
          v-model="filter"
          hide-details
          flat
          :label="$t('search.pools')"
          class="pa-0 search-bar"
          filled
          clearable
        />
      </f-panel>

      <f-panel class="mt-4 no-border-radius page-mid">
        <v-layout class="pools-header f-greyscale-3 pa-0 f-caption">
          <v-flex>
            <base-sortable-field
              value="totalValue"
              :sortby="sortby"
              :ascending="ascending"
              @sort="handleSort"
            >
              {{ $t("liquidity") }}
            </base-sortable-field>
          </v-flex>
          <div class="d-flex">
            <base-sortable-field
              value="volume"
              :sortby="sortby"
              :ascending="ascending"
              class="justify-end"
              @sort="handleSort"
            >
              {{ $t("volume.24hours") }}
            </base-sortable-field>
            <span class="mx-1">/</span>
            <base-sortable-field
              value="poolTurnover"
              :sortby="sortby"
              :ascending="ascending"
              class="justify-end"
              @sort="handleSort"
            >
              {{ $t("pool_turnover.24hours_short") }}
            </base-sortable-field>
          </div>
        </v-layout>
      </f-panel>

      <f-list class="mb-1">
        <pool-pair-item
          v-for="(item, index) in displayPairs"
          :key="index"
          :index="index"
          :pair="item"
          :expand-index.sync="expandIndex"
        />
      </f-list>

      <div
        v-if="displayPairs.length <= 0"
        class="d-flex flex-column align-center f-title-2"
      >
        <span style="margin-top: 15vh">
          {{ $t("liquidity.create.token-not-found") }}
        </span>
        <span class="mt-5 not-found" @click="goCreate">
          {{ $t("liquidity.create.new-liquidity-pool") }}
        </span>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { State } from "vuex-class";
import PoolPairItem from "@/components/particles/pool/PoolPairItemNew.vue";
import GlobalLiquidity from "@/components/particles/pool/GlobalLiquidity.vue";
import { IAsset, IPair } from "~/services/types/vo";
import BigNumber from "bignumber.js";

@Component({
  components: {
    PoolPairItem,
    GlobalLiquidity,
  },
})
class PoolsPage extends Mixins(mixins.page) {
  @State((state) => state.global.pairs) pairs!: IPair[];

  @State((state) => state.global.assets) assets!: IAsset[];

  get ascending() {
    return this.$store.state.pool.ascending;
  }

  set ascending(value) {
    this.$store.commit("pool/SET_ASCENDING", value);
  }

  get sortby() {
    return this.$store.state.pool.sortby;
  }

  set sortby(value) {
    this.$store.commit("pool/SET_SORTBY", value);
  }

  get filter() {
    return this.$store.state.pool.filter;
  }

  set filter(value) {
    this.$store.commit("pool/SET_FILTER", value || "");
  }

  get expandIndex() {
    return this.$store.state.pool.expandIndex;
  }

  set expandIndex(value) {
    this.$store.commit("pool/SET_EXPAND_INDEX", value);
  }

  get title() {
    return this.$createElement("base-swap-version-bar", {
      props: {
        title: this.$t("pools-mtg"),
      },
    }) as any;
  }

  get htmlTitle() {
    return this.$t("pools-mtg") as string;
  }

  get appbar() {
    return {
      show: true,
      back: false,
    };
  }

  get bottomNav() {
    return "pool";
  }

  get displayPairs() {
    const filteredAssetId = this.assets
      .filter((asset) => {
        const filter = this.filter?.toLowerCase()?.trim();
        const symbol = asset.symbol.toLowerCase();
        return symbol.startsWith(filter);
      })
      .map((asset) => asset.id);
    let pairs = this.pairs
      .filter((pair) => {
        return (
          filteredAssetId.includes(pair.base_asset_id) ||
          filteredAssetId.includes(pair.quote_asset_id)
        );
      })
      // @TODO prs event
      .filter((pair) => {
        return !(pair as any).hidden;
      })
      .map((pair) => {
        const totalValue = new BigNumber(pair.base_value)
          .plus(pair.quote_value)
          .toNumber();
        let poolTurnover = new BigNumber(pair.volume_24h)
          .div(totalValue)
          .multipliedBy(100)
          .toNumber();
        if (isNaN(poolTurnover)) {
          poolTurnover = 0;
        }
        return {
          ...pair,
          totalValue,
          poolTurnover,
          volume: Number(pair.volume_24h),
        };
      });
    pairs = pairs.sort((a, b) => {
      const va = a[this.sortby];
      const vb = b[this.sortby];
      return this.ascending ? va - vb : vb - va;
    });

    return pairs;
  }

  handleSort(params) {
    this.sortby = params.sortby;
    this.ascending = params.ascending;
  }

  goCreate() {
    this.$router.push({
      name: "liquidity-create",
      query: { jumpUrl: window.location.href },
    });
  }

  mounted() {
    this.$store.dispatch("global/getAllAddedPairs");
  }
}
export default PoolsPage;
</script>

<style lang="scss" scoped>
.page-top {
  padding: 21px 16px 11px !important;
  z-index: 11;
  transition: top 0.3s ease;
}

.page-mid {
  padding: 5px 16px 4px !important;
}

.search-bar {
  margin: 21px 0 10px 0;
  border: 0;
}

.not-found {
  color: var(--v-primary-base);
}
</style>
