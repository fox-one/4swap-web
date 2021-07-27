<template>
  <f-app-bar v-bind="appbar" @back="handleBack"> </f-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class LakeAppBarNav extends Vue {
  get appbar() {
    const state = this.$store.state;
    const appbar = state.app.appbar;

    return {
      ...appbar,
    };
  }

  handleBack() {
    if (window.history.length <= 1) {
      this.$router.push({ name: "index" });
    } else {
      this.$router.back();
    }
  }
}
export default LakeAppBarNav;
</script>
