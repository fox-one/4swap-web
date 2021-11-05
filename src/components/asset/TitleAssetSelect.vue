<template>
  <f-asset-select v-model="bindAsset" :assets="assets">
    <template #activator="{ on }">
      <div v-on="on" class="d-flex align-center">
        {{ title }}
        <v-icon size="16">$FIconChevronDown4P</v-icon>
      </div>
    </template>
  </f-asset-select>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from "vue-property-decorator";
import { GlobalGetters } from "~/store/types";

@Component
class TitleAssetSelect extends Vue {
  @PropSync("asset") bindAsset;

  get title() {
    return this.bindAsset?.symbol ?? "";
  }

  get assets() {
    return this.$store.getters[GlobalGetters.AVALIABLE_SWAP_ASSETS];
  }
}
export default TitleAssetSelect;
</script>
