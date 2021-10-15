<template>
  <f-bottom-sheet v-model="dialog" :title="$t('common.account')">
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

    <div>account settings</div>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Get } from "vuex-pathify";
import { GlobalGetters } from "~/store/types";

@Component
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
}
export default AccountAvatar;
</script>
