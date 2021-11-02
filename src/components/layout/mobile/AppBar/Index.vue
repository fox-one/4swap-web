<template>
  <div>
    <home-app-bar v-if="isHome" />
    <normal-app-bar v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HomeAppBar from "./Home.vue";
import NormalAppBar from "./Normal.vue";
import { Get } from "vuex-pathify";

@Component({
  components: {
    HomeAppBar,
    NormalAppBar,
  },
})
class AppBar extends Vue {
  @Get("app/appbar@style") style!: "home" | "nav";

  get isHome() {
    return this.style === "home";
  }
}
export default AppBar;
</script>
