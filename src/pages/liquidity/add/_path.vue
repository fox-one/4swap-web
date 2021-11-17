<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { useRedirectByPairPath } from "@/utils/helper";

@Component
class LiquidityAddByPath extends Vue {
  mounted() {
    useRedirectByPairPath(this, ({ baseAsset, quoteAsset }) => {
      this.$router.replace({
        name: "liquidity-add",
        query: { base: baseAsset?.id ?? "", quote: quoteAsset?.id ?? "" },
      });
    });
  }
}
export default LiquidityAddByPath;
</script>
