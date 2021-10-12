<template>
  <v-expand-transition>
    <f-tip v-if="meta.show" type="warning" class="mt-5 rounded">
      没有这个交易对，不能添加流动性，如何添加币对？
    </f-tip>
  </v-expand-transition>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class NoSuchPairTip extends Vue {
  @Prop() pair;

  get meta() {
    return {
      show: !this.pair,
    };
  }
}
export default NoSuchPairTip;
</script>
