<template>
  <v-layout class="f-caption py-2">
    <v-layout column align-center justify-center @click="handleAddLiq">
      <i class="primary rounded-circle icons">
        <v-icon color="greyscale_7" size="24">
          {{ $icons.mdiPlus }}
        </v-icon>
      </i>

      <span class="text--disabled mt-1">
        {{ $t("liquidity.add.action") }}
      </span>
    </v-layout>
    <v-layout column align-center justify-center @click="handleRemoveLiq">
      <i class="primary rounded-circle icons">
        <v-icon color="greyscale_7" size="24">
          {{ $icons.mdiMinus }}
        </v-icon>
      </i>
      <span class="text--disabled mt-1">
        {{ $t("liquidity.remove.action") }}
      </span>
    </v-layout>
    <v-layout column align-center justify-center @click="handleToDetail">
      <i class="primary rounded-circle icons">
        <v-icon color="greyscale_7" size="18">
          {{ $icons.mdiInformationVariant }}
        </v-icon>
      </i>
      <span class="text--disabled mt-1">
        {{ $t("info") }}
      </span>
    </v-layout>
    <v-layout column align-center justify-center @click="handleToHistory">
      <i class="primary rounded-circle icons">
        <v-icon color="greyscale_7" size="16">
          {{ $icons.mdiChartLineVariant }}
        </v-icon>
      </i>
      <span class="text--disabled mt-1">
        {{ $t("profit") }}
      </span>
    </v-layout>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class Actions extends Vue {
  @Prop() baseAsset;

  @Prop() quoteAsset;

  handleAddLiq() {
    this.$router.push({
      name: "liquidity-add",
      query: { base: this.baseAsset?.id, quote: this.quoteAsset?.id },
    });
  }

  handleRemoveLiq() {
    this.$router.push({
      name: "liquidity-remove",
      query: { base: this.baseAsset?.id, quote: this.quoteAsset?.id },
    });
  }

  handleToDetail() {
    this.$router.push({
      name: "pair-info",
      query: {
        base: this.baseAsset?.id,
        quote: this.quoteAsset?.id,
        type: "volume",
        duration: "720h",
      },
    });
  }

  handleToHistory() {
    this.$router.push({
      name: "liquidity-profit",
      query: {
        base: this.baseAsset?.id,
        quote: this.quoteAsset?.id,
        duration: "720h",
      },
    });
  }
}
export default Actions;
</script>
<style lang="scss" scoped>
.icons {
  display: inline-block;
  text-align: center;
  width: 24px;
  height: 24px;
  line-height: 20px;
}
</style>
