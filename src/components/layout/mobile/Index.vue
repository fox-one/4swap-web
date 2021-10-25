<template>
  <div>
    <app-bar />

    <v-main>
      <v-container class="pa-4">
        <nuxt />
      </v-container>
    </v-main>

    <bottom-nav />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppBar from "./AppBar/Index.vue";
import BottomNav from "./BottomNav.vue";

@Component({
  name: "mobile-layout",
  components: {
    AppBar,
    BottomNav,
  },
})
class MobileLayout extends Vue {}
export default MobileLayout;
</script>
