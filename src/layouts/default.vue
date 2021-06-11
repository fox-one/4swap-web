<template>
  <v-app id="app">
    <template v-if="meta.isIniting">
      <f-loading :loading="true" fullscreen>
        <template #text> {{ $t("initing") }} </template>
      </f-loading>
    </template>
    <template v-else>
      <default-layout-app-bar />
      <v-main
        class="pt-11"
        style="
          padding-bottom: calc(64px + env(safe-area-inset-bottom)) !important;
        "
      >
        <!-- <base-ws-connect-bar /> -->
        <nuxt />
      </v-main>
      <default-layout-bottom-nav />
      <default-layout-modals />
    </template>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppBar from "./default/AppBar.vue";
import BottomNav from "./default/BottomNav.vue";
import Modals from "./default/Modals.vue";

@Component({
  components: {
    "default-layout-modals": Modals,
    "default-layout-app-bar": AppBar,
    "default-layout-bottom-nav": BottomNav,
  },
})
class NuxtDefaultLayout extends Vue {
  get meta() {
    const isIniting = this.$store.state.app.initing;
    return {
      isIniting,
    };
  }

  mounted() {
    this.$utils.app.initApp(this);
    this.$pairRoutes.makeRoutes(this.$store.state.global.pairs);
    const tasks = this.$utils.app.genAppTasks(this);
    tasks.setUpPollingTasks();
  }
}
export default NuxtDefaultLayout;
</script>
