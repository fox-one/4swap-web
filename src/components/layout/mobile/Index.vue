<template>
  <div>
    <app-bar />

    <v-main :class="classes">
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
class MobileLayout extends Vue {
  get classes() {
    const contentClass = this.$store.state.app.contentClass;

    return { [contentClass]: true };
  }
}
export default MobileLayout;
</script>
