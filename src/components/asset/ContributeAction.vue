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
    const url_zh = "https://jinshuju.net/f/Fp4vFj";
    const url_en = "https://jinshuju.net/f/SlyulF";
    const lang = this.$vuetify.lang.current;

    window.location.href = lang === "zh" ? url_zh : url_en;
  }
}
export default ContributeAction;
</script>
