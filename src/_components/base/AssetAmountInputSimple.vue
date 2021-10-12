<template>
  <f-asset-amount-input v-bind="$attrs" v-on="$listeners">
    <template #activator>
      <f-mixin-asset-logo
        :logo="asset.logo"
        :chain-logo="asset.chainLogo"
        :size="32"
        class="ml-2"
      />
    </template>
  </f-asset-amount-input>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({ inheritAttrs: false })
class AssetAmountInput extends Vue {
  @Prop() asset;
}
export default AssetAmountInput;
</script>
