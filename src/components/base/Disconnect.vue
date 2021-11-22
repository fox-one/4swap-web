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
    this.$utils.account.requestLogout(this, {
      onDisconnect: () => {
        this.$emit("disconnected");
      },
    });
  }
}
</script>

<style></style>
