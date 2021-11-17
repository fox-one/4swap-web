<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { useRedirectByAssetSymbol } from "@/utils/helper";

@Component
class AssetDetailBySymbol extends Vue {
  mounted() {
    useRedirectByAssetSymbol(this, ({ asset }) => {
      this.$router.replace({
        name: "asset-detail",
        query: { id: asset?.id ?? "" },
      });
    });
  }
}
export default AssetDetailBySymbol;
</script>
