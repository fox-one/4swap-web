<template>
  <f-app-bottom-nav
    :app="true"
    :nav="bottomNav"
    :items="navItems"
    :animation="animation"
    active-class="f-caption"
    @change="handleChange"
  ></f-app-bottom-nav>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";

@Component
class DefaultLayoutBottomNav extends Vue {
  @State((state) => state.app.bottomNav.value)
  bottomNav;

  @State((state) => state.app.bottomNav.animation)
  animation;

  @Mutation("app/SET_BOTTOM_NAV") setBottomNav;

  get navItems() {
    return [
      {
        text: this.$t("pools"),
        icon: "$vuetify.icon.iconNavPool",
        path: "pool",
        value: "pool",
      },
      {
        text: this.$t("swap"),
        icon: "$vuetify.icon.iconNavSwap",
        path: "swap",
        value: "swap",
      },
      {
        text: this.$t("me"),
        icon: "$vuetify.icon.iconNavMe",
        path: "me",
        value: "me",
      },
    ];
  }

  handleChange(nav) {
    if (!nav || this.$route.name === nav.path) {
      return;
    }

    this.setBottomNav(nav.value);
    this.$router.push({ name: nav.path });
  }
}
export default DefaultLayoutBottomNav;
</script>
