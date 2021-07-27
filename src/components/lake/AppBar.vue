<template>
  <div>
    <app-bar-home v-if="isHome" />
    <app-bar-nav v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppBarHome from "./AppBarHome.vue";
import AppBarNav from "./AppBarNav.vue";

@Component({
  components: {
    AppBarNav,
    AppBarHome,
  },
})
class LakeAppBar extends Vue {
  get isHome() {
    return ["index", "pool", "swap", "me"].includes(this.$route.name as string);
  }
}
export default LakeAppBar;
</script>
