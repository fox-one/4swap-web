<template>
  <div
    class="wrapper"
    :style="{
      'max-width': maxWidth,
    }"
  >
    <span class="f-button-label-2 font-weight-medium amount"> 1 </span>
    <span class="f-superior symbol">
      {{ baseSymbol }}
    </span>
    <span class="font-weight-light">≈</span
    ><span class="f-button-label-2 font-weight-medium amount">
      {{ $utils.number.format({ n: amount }) }}
    </span>
    <span class="f-superior symbol">
      {{ symbol }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({ inheritAttrs: false })
class AssetPrice extends Vue {
  @Prop({ default: "", type: [String, Number, Object] }) baseSymbol!: string;
  @Prop({ default: "", type: [String, Number, Object] }) amount!: string;
  @Prop({ default: "", type: [String, Number, Object] }) symbol!: string;
  @Prop({ default: "", type: String }) maxWidth!: string;
}
export default AssetPrice;
</script>
<style lang="scss">
.wrapper {
  word-break: break-all;
}

.symbol {
  padding-left: 2px;
}
</style>
