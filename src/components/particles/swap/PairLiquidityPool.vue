<template>
  <div class="mt-4 mb-8">
    <div class="f-greyscale-1 mb-4 f-title-1">
      {{ $t("pool.added-assets") }}
    </div>
    <f-panel class="pt-6 px-6">
      <div
        v-if="!meta.hasLiquidity"
        class="f-greyscale-3 f-caption my-5 text-center"
      >
        {{ $t("liquidity.empty") }}
      </div>
      <v-layout justify-space-between v-else @click="gotoInfo">
        <asset-amount-item
          v-for="(item, index) in meta.items"
          :key="index"
          :asset="item.asset"
          :amount="item.amount"
        />
      </v-layout>
      <v-layout justify-center class="f-body-2 mt-3 f-greyscale-3">
        <a @click="handleAddLiq">
          {{ $t("liquidity.add") }}
        </a>
      </v-layout>
    </f-panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IAsset, IPair } from "~/services/types/vo";
import { State } from "vuex-class";
import AssetAmountItem from "./AssetAmountItem.vue";

@Component({
  components: {
    AssetAmountItem,
  },
})
class PairLiquidityPool extends Vue {
  @State((state) => state.global.assets) assets;

  @Prop() inputAsset!: IAsset | null;

  @Prop() outputAsset!: IAsset | null;

  @Prop() pair!: IPair | null;

  get meta() {
    const hasLiquidity = Number(this.pair?.liquidity) > 0;
    const baseAsset = this.assets.find(
      (a) => a.id === this.pair?.base_asset_id
    );
    const quoteAsset = this.assets.find(
      (a) => a.id === this.pair?.quote_asset_id
    );
    const items = [
      {
        asset: baseAsset,
        amount: this.pair?.base_amount ?? "",
      },
      {
        asset: quoteAsset,
        amount: this.pair?.quote_amount ?? "",
      },
    ];
    const reverse = this.outputAsset?.id === baseAsset?.id;
    return {
      hasLiquidity,
      items: reverse ? items.reverse() : items,
    };
  }

  handleAddLiq() {
    this.$router.push({
      name: "liquidity-add",
      query: { base: this.inputAsset?.id, quote: this.outputAsset?.id },
    });
  }

  gotoInfo() {
    const assets = this.meta.items;
    this.$router.push({
      name: "pair-info",
      query: { base: assets[0].asset.id, quote: assets[1].asset.id },
    });
  }
}
export default PairLiquidityPool;
</script>
