<template>
  <f-bottom-sheet
    v-model="dialog"
    min-width="500"
    z-index="111"
    wapper-in-desktop="dialog"
    content-class="f-bottom-sheet--no-padding"
  >
    <template #activator="{ on }">
      <pando-account-avatar
        :logged="logged"
        :name="meta.name"
        :avatar="meta.avatar"
        @click.native="on.click"
      />
    </template>

    <pando-account-overview
      :balance="meta.balance"
      :logged="logged"
      :name="$t('channel.name')"
      :user-name="meta.name"
      :user-avatar="meta.avatar"
      :version="VERSION"
      :mvm="$passport.helper.isMVM()"
      @close="handleClose"
      @connect="handleConnect"
      @disconnect="handleDisconnect"
    >
      <template #actions>
        <account-entry-actions />
      </template>
    </pando-account-overview>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Get } from "vuex-pathify";
import { GlobalGetters } from "@/store/types";
import { VERSION } from "@/constants";
import AccountEntryActions from "./AccountEntryActions.vue";

@Component({
  components: {
    AccountEntryActions,
  },
})
class AccountEntry extends Vue {
  @Get(GlobalGetters.LOGGED) logged!: boolean;

  dialog = false;

  VERSION = VERSION;

  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const getters = this.$store.getters;
    const balance = getters[GlobalGetters.GET_WALLET_BALANCE];
    const profile = this.$store.state.account.profile;

    return {
      avatar: profile?.avatar_url ?? "",
      name: profile?.full_name ?? "",
      balance: toFiat(this, { n: balance }, true),
    };
  }

  handleClose() {
    this.dialog = false;
  }

  handleConnect() {
    this.dialog = false;

    this.$utils.account.openAuth(this);
  }

  handleDisconnect() {
    this.$utils.account.requestLogout(this, {
      onDisconnect: () => {
        this.dialog = false;
      },
    });
  }
}
export default AccountEntry;
</script>
