import { GlobalMutations } from "~/store/types";

export async function loadAccountData(vm: Vue) {
  vm.$store.commit(GlobalMutations.SET_ACCOUNT_LOADING, true);

  await Promise.all([
    // vm.$store.dispatch(GlobalActions.LOAD_PROFILE),
    vm.$utils.assets.getAssets(vm),
  ]);

  vm.$store.commit(GlobalMutations.SET_ACCOUNT_LOADING, false);
}

export async function openAuth(vm: Vue) {
  try {
    const { channel, token } = await vm.$passport.auth();

    vm.$store.commit(GlobalMutations.SET_TOKEN, { token, channel });

    await loadAccountData(vm);
  } catch (error: any) {
    vm.$uikit.toast.error({ message: error.message || error.msg });
  }
}

export async function sync(vm: Vue) {
  try {
    const tokenLocale = vm.$store.state.auth.token;
    const channelLocale = vm.$store.state.auth.channel;
    const mixinTokenLocale = vm.$store.state.auth.mixin_token;

    if (!channelLocale) {
      logout(vm);

      return;
    }

    const auth = await vm.$passport.sync({
      channel: channelLocale,
      token: tokenLocale,
      mixin_token: mixinTokenLocale,
    });

    vm.$store.commit(GlobalMutations.SET_TOKEN, auth);
  } catch (error) {
    vm.$utils.helper.errorHandler(vm, error);
    logout(vm);
  }
}

export function logout(opts: any) {
  const { commit } = opts.$store;

  commit(GlobalMutations.CLEAR_AUTH);
  commit(GlobalMutations.CLEAR_ACCOUNT);
}

export function requestLogout(vm: Vue, cbs: { onDisconnect?: any }) {
  vm.$uikit.dialog.show({
    title: vm.$t("confirm") as string,
    text: vm.$t("disconnect.confrirm") as string,
    type: "warning",
    confirm: {
      text: vm.$t("disconnect") as string,
      callback: () => {
        vm.$utils.account.logout(vm);

        cbs?.onDisconnect?.();
      },
    },
  });
}
