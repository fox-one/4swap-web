<template>
  <div class="auth-page">
    <v-progress-circular :width="3" color="primary" indeterminate />
    <div class="mt-3 text--secondary">
      {{ $t("authing") }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";

@Component
class AuthPage extends Mixins(mixins.page) {
  get title() {
    return this.$t("common.authing") as string;
  }

  get appbar() {
    return {
      show: false,
    };
  }

  get code() {
    return this.$route.query.code as string;
  }

  async mounted() {
    try {
      await this.$utils.account.authMixin(this, this.code);
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
  }
}
export default AuthPage;
</script>

<style lang="scss" scoped>
.auth-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
