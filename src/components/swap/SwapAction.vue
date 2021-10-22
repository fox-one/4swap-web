<template>
  <f-button color="primary" v-bind="$attrs">
    {{ $t("swap") }}
  </f-button>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class SwapAction extends Vue {}
export default SwapAction;
</script>
