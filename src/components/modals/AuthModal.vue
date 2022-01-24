<template>
  <f-auth-method-modal
    ref="authModal"
    :fennec="fennec"
    :title="$t('connect-wallet')"
    @auth="handleLogin"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GLOBAL_EVENTS } from "@/constants";

@Component
class AuthModal extends Vue {
  fennec = false;

  get termsAccepted() {
    return this.$store.state.app.termsAccepted;
  }

  mounted() {
    setTimeout(() => {
      this.fennec = this.$fennec?.isAvailable() ?? false;
    }, 200);

    this.$root.$on(GLOBAL_EVENTS.OPEN_AUTH, () => {
      const authModal = this.$refs.authModal as any;

      if (!this.termsAccepted) {
        this.handleShowTerms();
      } else {
        authModal?.onClick();
      }
    });
  }

  handleShowTerms() {
    this.$root.$emit(GLOBAL_EVENTS.OPEN_TERMS_MODAL);
  }

  handleLogin(value) {
    if (value === "mixin") {
      this.$utils.account.requestAuthMixin(this);
    } else {
      this.$utils.account.authFennec(this);
    }
  }
}
export default AuthModal;
</script>
