<template>
  <v-form v-model="valid">
    <base-asset-amount-input
      :data="bindData"
      :assets="assets"
      :placeholder="$t('liquidity.amount')"
      fullfilled
      @update:asset="handleUpdateAsset"
      @input="handleInput"
    />

    <div class="mt-6">
      <slot name="information" />
    </div>

    <div class="text-center mt-6">
      <slot name="action" :valid="valid" />
    </div>
  </v-form>
</template>

<script lang="ts">
import { Component, PropSync, Prop, Vue } from "vue-property-decorator";
import { GlobalGetters } from "~/store/types";

@Component
class RemoveForm extends Vue {
  @PropSync("data") bindData;

  @Prop() pair;

  valid = false;

  get assets() {
    const getAssetById = this.$store.getters[GlobalGetters.GET_ASSET_BY_ID];
    const accountPairs = this.$store.getters[GlobalGetters.ACCOUNT_PAIRS];

    return accountPairs.map((x) => {
      return getAssetById(x.liquidity_asset_id);
    });
  }

  handleUpdateAsset(asset) {
    this.bindData.asset = asset;
  }

  handleInput(amount) {
    this.bindData.amount = amount;
  }
}
export default RemoveForm;
</script>
