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
    <v-tab v-for="(tab, index) in tabs" :key="index" :ripple="false">
      <span>{{ tab.text }}</span>
    </v-tab>

    <f-divider v-if="$vuetify.theme.dark" class="tab-divider" />
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
        text: this.$t("liquidity.my"),
      },
      {
        text: this.$t("market"),
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
</style>
