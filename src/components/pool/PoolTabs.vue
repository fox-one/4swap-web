<template>
  <f-tabs
    v-model="tabIndex"
    :ripple="false"
    :show-arrows="false"
    active-class="transparent"
    disable-slider-length
    slider-size="2"
    slider
  >
    <v-tab
      v-for="(tab, index) in tabs"
      :key="index"
      :ripple="false"
      class="tab-item"
    >
      <span>{{ tab.text }}</span>
    </v-tab>
  </f-tabs>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Sync } from "vuex-pathify";

@Component
class PoolTabs extends Vue {
  @Sync("page/pool@tabIndex") tabIndex!: number;

  get tabs() {
    return [{ text: this.$t("assets") }, { text: this.$t("pools") }];
  }
}
export default PoolTabs;
</script>

<style lang="scss" scoped>
.tab-item {
  padding: 0 !important;
  min-width: 60px;
  margin-right: 16px;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
}
</style>
