<template>
  <div>
    <slot v-if="!isLogged" name="action" :on="{ click: handleOpenAuth }">
      <f-button :loading="loading" color="primary" @click="handleOpenAuth">
        {{ $t("connect-wallet") }}
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

  loading = false;

  async handleOpenAuth() {
    this.loading = true;

    await this.$utils.account.openAuth(this);

    this.loading = false;
  }
}
</script>
