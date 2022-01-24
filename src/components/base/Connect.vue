<template>
  <div>
    <slot v-if="!isLogged" name="action" :on="{ click: handleOpenAuth }">
      <f-button color="primary" @click="handleConnectWallet">
        {{ $t("connect-wallet") }}
      </f-button>

      <f-bottom-sheet
        v-model="dialog"
        title="Use Terms"
        wapper-in-desktop="dialog"
      >
        <div class="pa-6">
          <div class="terms-title">
            {{ $t("terms.hint") }}
          </div>

          <div class="terms-items">
            <p>
              {{ $t("terms.item1") }}
            </p>
            <p>
              {{ $t("terms.item2") }}
            </p>
          </div>

          <div class="text-center mt-8">
            <f-button color="primary" @click="handleAcceptTerms">
              {{ $t("accept") }}
            </f-button>
          </div>
        </div>
      </f-bottom-sheet>
    </slot>

    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Get } from "vuex-pathify";
import { GlobalGetters, GlobalMutations } from "@/store/types";

@Component
export default class ConnectWalletBtn extends Vue {
  @Get(GlobalGetters.LOGGED) isLogged!: boolean;

  dialog = false;

  handleConnectWallet() {
    const termsAccepted = this.$store.state.app.termsAccepted;

    if (!termsAccepted) {
      this.handleShowTerms();
    } else {
      this.handleOpenAuth();
    }
  }

  handleAcceptTerms() {
    this.$store.commit(GlobalMutations.SET_TERMS_ACCEPTED, true);
    this.handleOpenAuth();
    this.dialog = false;
  }

  handleOpenAuth() {
    this.$utils.account.openAuth(this);
  }

  handleShowTerms() {
    this.dialog = true;
  }
}
</script>

<style lang="scss" scoped>
.terms-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--v-greyscale_2-base);
}

.terms-items {
  margin-top: 24px;
  font-size: 12px;
  color: var(--v-greyscale_3-base);
}
</style>
