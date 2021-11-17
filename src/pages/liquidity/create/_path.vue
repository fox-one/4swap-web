<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { useRedirectByPairPath } from "@/utils/helper";

@Component
class LiquidityCreateByPath extends Vue {
  mounted() {
    useRedirectByPairPath(this, ({ baseAsset, quoteAsset }) => {
      this.$router.replace({
        name: "liquidity-create",
        query: { base: baseAsset?.id ?? "", quote: quoteAsset?.id ?? "" },
      });
    });
  }
}
export default LiquidityCreateByPath;
</script>
