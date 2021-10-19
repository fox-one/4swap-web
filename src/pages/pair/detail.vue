<template>
  <v-container> asdf </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";

@Component
class PairDetailPage extends Mixins(mixins.page) {
  get htmlTitle() {
    // return this.meta.symbol;
    return "asdfa";
  }

  get title() {
    return "asdfa";
    // return this.$createElement("base-pair-icon", {
    //   staticStyle: {
    //     "justify-content": "center",
    //   },
    //   props: {
    //     "base-asset": this.meta.baseAsset,
    //     "quote-asset": this.meta.quoteAsset,
    //     small: true,
    //   },
    // }) as any;
  }

  get appbar() {
    return {
      align: "center",
    };
  }
}
export default PairDetailPage;
</script>
