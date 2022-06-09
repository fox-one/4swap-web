<template>
  <f-tabs
    v-model="tabIndex"
    :ripple="false"
    :show-arrows="false"
    active-class="transparent"
    disable-slider-length
    slider-size="2"
    grow
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
class PageTabs extends Vue {
  @Sync("page/pairDetail@tabIndex") tabIndex!: number;

  get tabs() {
    return [
      {
        text: this.$t("market"),
      },
      {
        text: this.$t("liquidity.my"),
      },
    ];
  }
}
export default PageTabs;
</script>

<style lang="scss" scoped>
.tab-divider {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.tab-item {
  font-weight: 500;
  font-size: 16px;
}
</style>
