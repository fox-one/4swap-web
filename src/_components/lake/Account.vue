<template>
  <base-user-avatar
    v-if="isLogged"
    :avatar="meta.avatar"
    :name="meta.name"
    color="primary"
    size="28"
    @click="handleToSetting"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class Account extends Vue {
  get isLogged() {
    return this.$store.getters["auth/isLogged"];
  }

  get meta() {
    let { avatar_url, full_name = this.$t("me") } =
      this.$store.getters["global/getUserInfo"] || {};

    return {
      avatar: avatar_url,
      name: full_name,
    };
  }

  handleToSetting() {
    this.$router.push({ name: "settings" });
  }
}
export default Account;
</script>
