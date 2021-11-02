<template>
  <v-layout class="fee">
    <f-mixin-asset-logo :logo="meta.logo" :size="24" />
    <span class="ml-2">{{ meta.text }}</span>
    <v-spacer />
    <span class="hint"> ≈ {{ meta.fiatText }} </span>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";
import { CREATE_FEE } from "@/constants";

@Component
class CreateFee extends Vue {
  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const getAssetById = this.$store.getters[GlobalGetters.GET_ASSET_BY_ID];
    const asset = getAssetById(CREATE_FEE.asset_id);

    const logo = asset?.logo ?? "";
    const symbol = asset?.symbol ?? "";
    const price = asset?.price ?? 0;
    const fiatText = toFiat(this, { n: +price * CREATE_FEE.amount });

    return {
      logo,
      text: `${CREATE_FEE.amount} ${symbol}`,
      fiatText,
    };
  }
}
export default CreateFee;
</script>

<style lang="scss" scoped>
.fee {
  align-items: center;
  padding: 16px;
  height: 56px;
  border-radius: 8px;
  background-color: var(--v-greyscale_6-base);
  font-weight: 600;
  font-size: 16px;

  .hint {
    font-size: 12px;
    font-weight: normal;
    color: var(--v-greyscale_3-base);
  }
}
</style>
