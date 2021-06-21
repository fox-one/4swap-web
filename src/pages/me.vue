<template>
  <v-container class="pa-0">
    <base-connect-wallet-btn v-if="!isLogged" />
    <template v-else>
      <balance-panel @input="handleSearch" @onMount="handleSearch" />
      <div v-if="totalPairs.length === 0">
        <div class="f-title-1 f-greyscale-3 hint-title">
          {{ $t("me.not.support") }}
        </div>
        <div class="my-8" style="text-align: center">
          <v-btn
            rounded
            depressed
            color="primary"
            @click="handleAddLiquidity"
            class="mx-8 px-14 text-subtite-1"
            style="height: 48px"
          >
            {{ $t("liquidity.add") }}
          </v-btn>
        </div>
        <div style="text-align: center">
          <v-btn text color="primary" @click="handle4swapDoc">
            {{ $t("me.learn.more") }}
          </v-btn>
        </div>
      </div>
      <div v-else class="mt-4 px-4">
        <shared-pair
          v-for="(pair, index) in sharedPairs"
          :key="index"
          :index="index"
          :pair="pair"
          :expand-index.sync="expandIndex"
          show-actions
        />
        <f-tip
          v-if="totalPairs.length !== 0 && sharedPairs.length === 0"
          type="warning"
          class="rounded"
        >
          {{ $t("liquidity.mine.empty") }}
        </f-tip>
      </div>
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import BalancePanel from "@/components/particles/me/BalancePanel.vue";
import SharedPair from "@/components/particles/liquidity/shared-pair/SharedPair.vue";
import { VIcon, VBtn } from "vuetify/lib";
import { Getter } from "vuex-class";

@Component({
  components: {
    SharedPair,
    BalancePanel,
  },
})
class MePage extends Mixins(mixins.page) {
  @Getter("global/getAssetById") getAssetById;

  totalPairs: API.Pair[] = this.$store.getters["global/getSharedPairs"];

  searchValue = "";

  // sharedPairs: IPair[] = this.totalPairs;

  get isLogged() {
    return this.$store.getters["auth/isLogged"];
  }

  get expandIndex() {
    return this.$store.state.pool.historyExpandIndex;
  }

  set expandIndex(value) {
    this.$store.commit("pool/SET_HISTORY_EXPAND_INDEX", value);
  }

  get htmlTitle() {
    return this.$t("me") as string;
  }

  get title() {
    const h = this.$createElement;
    let { avatar_url, full_name = this.$t("me") } =
      this.$store.getters["global/getUserInfo"] || {};

    if (full_name.length > 12) {
      full_name = full_name.slice(0, 12);
    }

    return h(
      "div",
      {
        staticClass: "d-flex justify-start align-center",
      },
      [
        h("img", {
          staticStyle: {
            display: avatar_url ? "inline-block" : "none",
            width: "32px",
            height: "32px",
            "border-radius": "50%",
            "margin-right": "9px",
          },
          domProps: {
            src: avatar_url,
          },
        }),
        h("div", {
          staticClass: "f-title-3 font-weight-bold text-truncate",
          staticStyle: {
            "max-width": "50vw",
          },
          domProps: {
            innerHTML: full_name,
          },
        }),
        h(
          VBtn,
          {
            props: {
              color: "f-greyscale-3 ml-4",
              icon: true,
              small: true,
            },
            on: { click: () => this.gotoSettings() },
          },
          [
            h(
              VIcon,
              {
                props: {
                  size: 20,
                },
              },
              [this.$icons.mdiCog]
            ),
          ]
        ),
      ]
    ) as any;
  }

  get bottomNav() {
    return "me";
  }

  get appbar() {
    return {
      back: false,
    };
  }

  get sharedPairs() {
    if (!this.searchValue) {
      return this.sortedPairs;
    }
    return this.sortedPairs.filter((pair) => {
      const id = pair.liquidity_asset_id;
      const finder = this.$store.getters["global/getAssetById"];
      const symbol = finder(id).symbol.toLowerCase();
      this.searchValue = this.searchValue.toLowerCase();
      return symbol.includes(this.searchValue);
    });
  }

  get sortedPairs() {
    const ret = this.totalPairs.slice();
    ret.sort((a, b) => {
      const ta = this.calTotalValue(a);
      const tb = this.calTotalValue(b);
      if (ta > tb) {
        return -1;
      } else if (ta < tb) {
        return +1;
      }
      return 0;
    });
    return ret;
  }

  mounted() {
    this.$store.dispatch("global/getAllAddedPairs", {
      brokerId: this.$config.BROKER_ID,
    });
    this.$utils.helper.loadWalletAssets(this);
  }

  handleAddLiquidity() {
    this.$router.push({ name: "liquidity-add" });
  }

  handle4swapDoc() {
    location.assign("https://zh.cms.fox.one/2020/10/19/4swap/");
  }

  handleSearch(val: string) {
    this.searchValue = val.trim();
  }

  calTotalValue(pair) {
    // @TODO refactor here.
    // the meta getter in SharedPair has similar logic.
    const baseAsset = this.getAssetById(pair.base_asset_id);
    const quoteAsset = this.getAssetById(pair.quote_asset_id);
    const liquidityAsset = this.getAssetById(pair.liquidity_asset_id);
    const balance = this.$store.getters["global/getBalanceByAssetId"](
      pair.liquidity_asset_id
    );
    const s = liquidityAsset ? Number(balance ?? 0) : Number(pair?.share ?? 0);
    const k = Number(pair?.liquidity ?? 0);

    const totalBaseAmount = Number(pair?.base_amount ?? 0);
    const totalQuoteAmount = Number(pair?.quote_amount ?? 0);
    const percent = k > 0 ? Math.min(s / k, 1) : 0;

    const sharedBaseAmount = totalBaseAmount * percent;
    const sharedQuoteAmount = totalQuoteAmount * percent;
    const totalValue =
      sharedBaseAmount * Number(baseAsset?.price ?? 0) +
      sharedQuoteAmount * Number(quoteAsset?.price ?? 0);
    return totalValue;
  }

  gotoSettings() {
    this.$router.push({ name: "settings" });
  }
}
export default MePage;
</script>

<style lang="scss" scoped>
.hint {
  &-title {
    margin-top: 111px;
    text-align: center;
  }
}
</style>
