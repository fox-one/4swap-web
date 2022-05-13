<template>
  <f-auth-method-modal
    ref="authModal"
    :fennec="fennec"
    :title="$t('connect-wallet')"
    @auth="handleLogin"
    :client-id="clientId"
    :scope="scope"
    :is-firesbox="false"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GLOBAL_EVENTS } from "@/constants";

@Component
class AuthModal extends Vue {
  fennec = false;

  clientId = this.$config.MIXIN_CLIENT_ID;

  scope = "PROFILE:READ ASSETS:READ";

  mounted() {
    setTimeout(() => {
      this.fennec = this.$fennec?.isAvailable() ?? false;
    }, 200);

    this.$root.$on(GLOBAL_EVENTS.OPEN_AUTH, () => {
      const authModal = this.$refs.authModal as any;

      authModal?.onClick();
    });
  }

  handleLogin(data) {
    if (data?.type === "mixin") {
      this.$utils.account.authMixin(this, data?.code);
    } else {
      this.$utils.account.authFennec(this);
    }
  }
}
export default AuthModal;
</script>
