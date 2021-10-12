<template>
  <div>
    <f-asset-select
      v-bind="$attrs"
      v-on="$listeners"
      activatorClass="asset-selector"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({ inheritAttrs: false })
class AssetSelector extends Vue {}
export default AssetSelector;
</script>
<style lang="scss" scoped>
::v-deep {
  .asset-selector {
    border-radius: 8px !important;
  }
}
</style>
