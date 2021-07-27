<template>
  <v-app-bar app fixed flat :color="color">
    <f-button v-if="back" small icon @click="handleBack">
      <v-icon>{{ $icons.mdiArrowLeft }}</v-icon>
    </f-button>
    <v-toolbar-title class="d-flex align-center">
      <swap-verison-switch :title="title" />
    </v-toolbar-title>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import SwapVerisonSwitch from "./SwapVersionSwitch.vue";

@Component({
  components: {
    SwapVerisonSwitch,
  },
})
class AppEnvBar extends Vue {
  @Prop({ type: String, default: "" }) title!: string;

  @Prop({ type: Boolean, default: false }) back!: boolean;

  get color() {
    const isDark = this.$store.state.app.dark;
    return isDark ? "#000000" : "#FFFFFF";
  }

  handleBack() {
    this.$emit("back");
  }
}
export default AppEnvBar;
</script>
