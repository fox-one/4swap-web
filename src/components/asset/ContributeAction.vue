<template>
  <f-button color="primary" @click="handleContribute">
    {{ $t("liquidity.create.toast.btn.contribute") }}
  </f-button>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class ContributeAction extends Vue {
  handleContribute() {
    window.location.href = "https://github.com/fox-one/4swap-assets";
  }
}
export default ContributeAction;
</script>
