<template>
  <f-slider-tabs
    :value="current"
    :grow="true"
    :hide-slider="true"
    :max-slider-width="20"
    background-color="transparent"
    class="mb-8"
    @change="handleTabChange"
  >
    <template #tabs>
      <v-tab
        v-for="(t, index) in tabs"
        :key="index"
        :data-value="index"
        :ripple="false"
        class="tab-item"
      >
        <span>{{ t }}</span>
      </v-tab>
    </template>
  </f-slider-tabs>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class SwapTabs extends Vue {
  @Prop() current;

  get tabs() {
    return [this.$t("swap"), this.$t("pools")];
  }

  handleTabChange(value) {
    const path = value === 0 ? "swap" : "liquidity";
    if (this.$route.name !== path) {
      this.$router.replace({ name: path, query: this.$route.query });
    }
  }
}
export default SwapTabs;
</script>

<style lang="scss" scoped>
.tab-item {
  min-width: 50%;
}
</style>
