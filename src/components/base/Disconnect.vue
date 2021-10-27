<template>
  <div>
    <slot v-if="isLogged" name="action" :on="{ click: handleDisconnect }">
      <f-button
        depressed
        color="#FBF2F2"
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
    this.$utils.account.logout(this);
  }
}
</script>

<style></style>
