<template>
  <f-app-bar
    app
    custom-content
    flat
    :extension-height="appbar.extensionHeight"
    :show="appbar.show"
    :color="appbar.color"
    :class="{ 'appbar--shadow': appbar.extension }"
  >
    <v-layout justify-center align-center class="appbar--home">
      <div class="account">
        <account-entry />
      </div>

      <pando-products :current-id="isLake ? 'lake' : '4swap'" z-index="111" />
    </v-layout>

    <template v-slot:extension v-if="appbar.extension">
      <Render :nodes="appbar.extension" />
    </template>
  </f-app-bar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Render from "@/components/base/Render";
import AccountEntry from "../../partial/AccountEntry.vue";

@Component({
  components: {
    AccountEntry,
    Render,
  },
})
class HomeAppBar extends Vue {
  get appbar() {
    const appbar = this.$store.state.app.appbar;
    const defaultThemeColor = this.$vuetify.theme.dark ? "#000000" : "#ffffff";
    const color = appbar.color || defaultThemeColor;

    return {
      show: appbar.show,
      color,
      ...appbar,
    };
  }

  get isLake() {
    return this.$config.CHANNEL === "lake";
  }

  @Watch("appbar.color", { immediate: true })
  handleColorChange(value: string) {
    this.$utils.mixin.setMixinTheme(value);
  }
}
export default HomeAppBar;
</script>

<style lang="scss" scoped>
.appbar--home {
  position: relative;

  .account {
    position: absolute;
    left: 0;
  }
}

.appbar--shadow {
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.06) !important;
}

.theme--dark {
  .appbar--shadow {
    box-shadow: 0px 0px 24px rgba(255, 255, 255, 0.12) !important;
  }
}
</style>
