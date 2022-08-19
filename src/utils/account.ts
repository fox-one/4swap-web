import { GlobalActions, GlobalGetters, GlobalMutations } from "~/store/types";

export async function loadAccountData(vm: Vue) {
  await Promise.all([
    vm.$store.dispatch(GlobalActions.LOAD_PROFILE),
    vm.$utils.assets.getAssets(vm),
  ]);

  const shared = vm.$store.getters[GlobalGetters.ACCOUNT_PAIRS](vm);

  shared.forEach((pair) => {
    const { base_asset_id, quote_asset_id } = pair;

    vm.$store.dispatch(GlobalActions.LOAD_PROFIT, {
      base: base_asset_id,
      quote: quote_asset_id,
    });
  });
}

export async function openAuth(vm: Vue) {
  try {
    const { channel, token } = await vm.$passport.auth();

    vm.$store.commit(GlobalMutations.SET_TOKEN, { token, channel });

    await loadAccountData(vm);
  } catch (error: any) {
    vm.$uikit.toast.error({ message: error.message });
  }
}

export async function sync(vm: Vue) {
  try {
    const tokenLocale = vm.$store.state.auth.token;
    const channelLocale = vm.$store.state.auth.channel;

    if (!channelLocale) {
      logout(vm);

      return;
    }

    const auth = await vm.$passport.sync({
      channel: channelLocale,
      token: tokenLocale,
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
