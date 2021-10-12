<template>
  <div
    class="wrapper"
    :style="{
      'max-width': maxWidth,
    }"
  >
    <span
      class="f-button-label-2 font-weight-medium amount"
      :style="{
        color,
      }"
    >
      {{ amount }}
    </span>
    <span class="f-superior symbol">
      {{ symbol }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({ inheritAttrs: false })
class AssetWithSymbol extends Vue {
  @Prop({ default: "", type: [String, Number, Object] }) amount!: string;
  @Prop({ default: "", type: [String, Number, Object] }) symbol!: string;
  @Prop({ default: "", type: String }) color!: string;
  @Prop({ default: "", type: String }) maxWidth!: string;
}
export default AssetWithSymbol;
</script>
<style lang="scss">
.wrapper {
  word-break: break-all;
}

.symbol {
  padding-left: 2px;
}
</style>
