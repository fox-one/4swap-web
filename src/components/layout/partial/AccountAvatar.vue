<template>
  <f-bottom-sheet v-model="dialog" hide-close-icon>
    <template #activator="{ on }">
      <base-user-avatar
        v-show="isLogged"
        :avatar="meta.avatar"
        :name="meta.name"
        color="primary"
        size="32"
        v-on="on"
      />
    </template>

    <account-setting-overview
      @disconnected="handleDisconnected"
      @close="handleClose"
    />
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Get } from "vuex-pathify";
import { GlobalGetters } from "@/store/types";
import AccountSettingOverview from "@/components/account/AccountSettingOverview.vue";

@Component({
  components: {
    AccountSettingOverview,
  },
})
class AccountAvatar extends Vue {
  @Get("account/profile") profile!: API.MixinUser | null;

  @Get(GlobalGetters.LOGGED) isLogged!: boolean;

  dialog = false;

  get meta() {
    return {
      avatar: this.profile?.avatar_url ?? "",
      name: this.profile?.full_name ?? "",
    };
  }

  handleClose() {
    this.dialog = false;
  }

  handleDisconnected() {
    this.$router.push({ name: "pool" });
    this.dialog = false;
  }
}
export default AccountAvatar;
</script>
