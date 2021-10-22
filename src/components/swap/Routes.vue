<template>
  <span class="routes">{{ meta.text }}</span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GlobalGetters } from "~/store/types";

@Component
class Routes extends Vue {
  @Prop() assets!: string[];

  get meta() {
    const getAssetById = this.$store.getters[GlobalGetters.GET_ASSET_BY_ID];
    const text = this.assets
      .map((x) => {
        const asset = getAssetById(x);

        return asset.display_symbol || asset.symbol;
      })
      .join(" -> ");

    return { text };
  }
}
export default Routes;
</script>
