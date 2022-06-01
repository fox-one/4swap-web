<template>
  <f-tabs
    v-model="tabIndex"
    :ripple="false"
    :show-arrows="false"
    active-class="transparent"
    disable-slider-length
    slider-size="2"
    slider
    grow
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
class AssetTabs extends Vue {
  @Sync("page/asset@tabIndex") tabIndex!: number;

  get tabs() {
    return [{ text: this.$t("overview") }, { text: this.$t("pools") }];
  }
}
export default AssetTabs;
</script>
