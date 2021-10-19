import { GlobalActions, GlobalMutations } from "~/store/types";

const scope = "['PROFILE:READ', 'ASSETS:READ', 'SNAPSHOTS:READ']";

/**
 * redirect to mixin oauth page
 *
 * @export
 * @param {Vue} vm
 */
export function requestLogin(vm: Vue) {
  const host = window.location.origin;
  const redirectUrl = encodeURIComponent(host + "/#/auth/");
  const path = `https://mixin-oauth.fox.one/?client_id=${vm.$config.MIXIN_CLIENT_ID}&scope=PROFILE:READ+ASSETS:READ&response_type=code&redirect_url=${redirectUrl}`;

  localStorage.setItem("authPath", window.location.href);
  window.location.href = path;
}

/**
 * use mixin oauth code exhange access token
 *
 * @export
 * @param {Vue} vm
 * @param {string} code
 */
export async function authMixin(vm: Vue, code: string) {
  const res = await vm.$http.auth({
    code,
    broker_id: vm.$config.BROKER_ID,
    label: vm.$config.CHANNEL,
  });
  const redirect = localStorage.getItem("authPath") || "/";

  await updateAuth(vm, {
    token: res.access_token,
    scope: res.scope,
    channel: "mixin",
  });
  document.location.replace(redirect);
}

/**
 * connect to fennec
 *
 * @export
 * @param {Vue} vm
 */
export async function authFennec(vm: Vue) {
  await vm.$fennec.connect(vm.$config.CHANNEL_NAME);

  const token = await vm.$fennec.ctx!.wallet.signToken({
    payload: { from: vm.$config.CHANNEL },
  });

  await updateAuth(vm, { token, scope, channel: "fennec" });
}

/**
 * logout from application
 * clear auth and account data from storeage
 *
 * @export
 * @param {{ store: Store<any> }} opts
 */
export function logout(opts: any) {
  const { commit } = opts.store;

  commit(GlobalMutations.CLEAR_AUTH);
  commit(GlobalMutations.CLEAR_ACCOUNT);
}

/**
 * if last auth channel is fennec
 * then auto connect to fennec
 *
 * @export
 * @param {Vue} vm
 * @return {*}
 */
export function checkFennecAuth(vm: Vue) {
  if (vm.$store.state.auth.channel === "fennec") {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await vm.$fennec.connect("Pando Rings");
          resolve(true);
        } catch (error) {
          // if some error occur during auto connect
          // clear auth channel from localstoreage
          logout({ store: vm.$store });
          reject();
        }
      }, 1000);
    });
  }
}
/**
 * save auth token to vuex
 * then reload account data
 *
 * @export
 * @param {Vue} vm
 * @param {{ token: string; scope: string; channel: string }} payload
 */
export async function updateAuth(
  vm: Vue,
  payload: { token: string; scope: string; channel: string }
) {
  vm.$store.commit("auth/SET_OAUTH_INFO", payload);

  await loadAccountData(vm);
}
/**
 * load account data: profile, wallet assets
 *
 * @export
 * @param {Vue} vm
 */
export async function loadAccountData(vm: Vue) {
  vm.$store.dispatch(GlobalActions.LOAD_PROFILE);
  vm.$utils.assets.getAssets(vm);
}