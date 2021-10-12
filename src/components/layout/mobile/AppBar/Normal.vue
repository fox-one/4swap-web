<template>
  <f-app-bar
    v-if="appbar.show"
    app
    flat
    center
    :title="appbar.title"
    :back="appbar.back"
    :class="{ 'appbar--shadow': appbar.extension }"
    :extensionHeight="appbar.extensionHight"
    :color="appbar.color"
    @back="handleBack"
  >
    <template v-slot:extension v-if="appbar.extension">
      <Render :nodes="appbar.extension" />
    </template>
  </f-app-bar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Render from "@/components/base/Render";

@Component({
  components: {
    Render,
  },
})
class NormalAppBar extends Vue {
  get appbar() {
    const state = this.$store.state;
    const appbar = state.app.appbar;
    const defaultThemeColor = this.$vuetify.theme.dark ? "#000000" : "#ffffff";
    const color = appbar.color || defaultThemeColor;

    return {
      color,
      ...appbar,
    };
  }

  @Watch("appbar.color", { immediate: true })
  handleColorChange(value: string) {
    this.$utils.mixin.setMixinTheme(value);
  }
}
export default NormalAppBar;
</script>

<style lang="scss" scoped>
.appbar--shadow {
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.06) !important;
}
</style>
