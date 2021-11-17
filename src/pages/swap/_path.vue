<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { useRedirectByPairPath } from "@/utils/helper";

@Component
class SwapByPath extends Vue {
  mounted() {
    useRedirectByPairPath(this, ({ baseAsset, quoteAsset }) => {
      this.$router.replace({
        name: "swap",
        query: { input: baseAsset?.id ?? "", output: quoteAsset?.id ?? "" },
      });
    });
  }
}
export default SwapByPath;
</script>
