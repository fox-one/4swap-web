<template>
  <div>
    <slot v-if="isLogged" name="action" :on="{ click: handleDisconnect }">
      <f-button
        depressed
        color="error_bg"
        class="error--text"
        @click="handleDisconnect"
      >
        {{ $t("disconnect") }}
      </f-button>
    </slot>

    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Get } from "vuex-pathify";
import { GlobalGetters } from "@/store/types";

@Component
export default class ConnectWalletBtn extends Vue {
  @Get(GlobalGetters.LOGGED) isLogged!: boolean;

  handleDisconnect() {
    this.$uikit.dialog.show({
      title: this.$t("confirm") as string,
      text: "Confirm to disconnect your wallet?",
      type: "warning",
      confirm: {
        text: "Disconnect",
        callback: () => {
          this.$utils.account.logout(this);

          this.$emit("disconnected");
        },
      },
    });
  }
}
</script>

<style></style>
