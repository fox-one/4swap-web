<template>
  <v-expand-transition>
    <v-system-bar
      v-if="meta.show"
      dark
      class="ws-connect-bar caption justify-center"
      :color="meta.color"
      :style="meta.style"
    >
      <template v-if="meta.isDisConnected">
        <v-icon size="14">{{ $icons.mdiLinkOff }}</v-icon>
        <span>{{ $t("websocket.disconnected") }}</span>
        <v-spacer />
        <span @click="handleReconnect">{{ $t("websocket.reconnect") }}</span>
      </template>
      <template v-if="meta.isConnecting">
        <v-progress-circular
          indeterminate
          size="16"
          width="1"
          class="mr-2"
          color="rgba(255, 255, 255, 0.7)"
        />
        <span>{{ $t("websocket.connecting") }}</span>
      </template>
    </v-system-bar>
  </v-expand-transition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
class SystemBar extends Vue {
  @State((state) => state.app.websocket.state) state;

  @State((state) => state.app.bottomNav.value) bottomNav;

  get meta() {
    const isConnecting = this.state === WebSocket.CONNECTING;
    return {
      isConnecting,
      color: isConnecting ? "info" : "error",
      show: isConnecting,
      style: { bottom: this.bottomNav ? "64px" : "0" },
    };
  }

  handleReconnect() {
    this.$ws._connect();
  }
}
export default SystemBar;
</script>

<style lang="scss" scoped>
.ws-connect-bar {
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  z-index: 12;
}
</style>
