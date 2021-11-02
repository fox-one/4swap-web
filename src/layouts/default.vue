<template>
  <v-app id="app">
    <f-loading v-if="initing" :loading="initing" color="primary" fullscreen />

    <template v-else>
      <mobile-layout />
      <modals />
    </template>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MobileLayout from "@/components/layout/mobile/Index.vue";
import Modals from "@/components/modals/Index.vue";
import { Sync } from "vuex-pathify";

@Component({
  components: {
    MobileLayout,
    Modals,
  },
})
class NuxtDefaultLayout extends Vue {
  @Sync("app/initing") initing!: boolean;

  get desktop() {
    return this.$vuetify.breakpoint.mdAndUp;
  }

  async mounted() {
    try {
      await this.$utils.app.init(this);
      // this.$utils.app.tasks.setUpPollingTasks(this);
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
  }
}
export default NuxtDefaultLayout;
</script>
