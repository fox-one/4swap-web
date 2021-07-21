/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from "vue";

export function toast(vue: Vue, data: { message: string; color?: string }) {
  vue.$store.commit("app/SET_TOAST", data);
}

export function message(
  vue: Vue,
  text: {
    title: string;
    description?: string;
    ok?: string;
    cancel?: string;
    okColor?: string;
  },
  handler: { onOK?: () => void; onCancel?: () => void } = {}
) {
  vue.$root.$emit("SHOW_SIMPLE_MESSAGE_MODAL", text, handler);
}

export function errorHandler(
  vue: Vue,
  error: { message?: string; msg?: string; code: string | number }
) {
  const fallback = "未知错误";
  const message = `${error.code || ""} ${
    error.message || error.msg || fallback
  }`;
  toast(vue, { message, color: "error" });
}

export function getMixinContext() {
  let ctx: any = {};
  const win: any = window;
  if (win.webkit?.messageHandlers?.MixinContext) {
    ctx = JSON.parse(prompt("MixinContext.getContext()") as any);
    ctx.platform = ctx.platform || "iOS";
  } else if (typeof win.MixinContext?.getContext === "function") {
    ctx = JSON.parse(win.MixinContext.getContext());
    ctx.platform = ctx.platform || "Android";
  }
  return ctx;
}

export function isMixin() {
  const platform = getMixinContext().platform;
  return platform === "iOS" || platform === "Android";
}

export function loadMixinTheme() {
  const platform = getMixinContext().platform;
  const win: any = window;
  switch (platform) {
    case "iOS":
      win.webkit.messageHandlers.reloadTheme.postMessage("");
      return;
    case "Android":
      win.MixinContext.reloadTheme();
  }
}

export function getToken(store) {
  return store.getters["auth/getToken"];
}

export function getLocale() {
  let locale = "en";
  if (navigator.language.includes("zh")) {
    locale = "zh";
  } else if (navigator.language.includes("ja")) {
    locale = "ja";
  }
  return locale;
}

export function genPaymentUrl(data: {
  recipient: string;
  assetId: string;
  amount: string;
  traceId: string;
  memo: string;
}) {
  const { recipient, assetId, amount, traceId, memo } = data;
  return `mixin://pay?recipient=${recipient}&asset=${assetId}&amount=${amount}&trace=${traceId}&memo=${memo}`;
}

export function requestLogin(vm: Vue) {
  const host = window.location.origin;
  const redirectUrl = encodeURIComponent(host + "/#/auth/");
  localStorage.setItem("authPath", window.location.href);
  let path = `https://mixin-oauth.fox.one/?client_id=${vm.$config.MIXIN_CLIENT_ID}&scope=PROFILE:READ+ASSETS:READ&response_type=code`;
  path += `&redirect_url=${redirectUrl}`;
  window.location.href = path;
}

export function debounce(fn: any, delay: number) {
  let timeoutId = 0 as any;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
) {
  let throttling = false;
  return (...args: Parameters<T>): void | ReturnType<T> => {
    if (!throttling) {
      throttling = true;
      setTimeout(() => (throttling = false), limit);
      return fn(...args);
    }
  };
}

export function isDesktop() {
  return !navigator.userAgent.match(
    /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i
  );
}

export function isDarkTheme() {
  try {
    const context = getMixinContext();
    if (context?.appearance) {
      return context.appearance === "dark";
    }
  } catch (error) {}

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function getAndroidVersion() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf("android") > 0) {
    const reg = /android [\d._]+/gi;
    const v_info = ua.match(reg);
    const version = (v_info + "")
      .replace(/[^0-9|_.]/gi, "")
      .replace(/_/gi, "."); // 得到版本号4.2.2
    const majorVersion = parseInt(version.split(".")[0]); // 得到版本号第一位
    return majorVersion;
  }
  return 0;
}

export function isAndroid() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("android");
}

export function notSupportIntersect() {
  if (isAndroid() && getAndroidVersion() < 8) {
    return true;
  }
  return !window.IntersectionObserver;
}

export async function loadWalletAssets(vue: Vue) {
  const store = vue.$store;
  if (vue.$fennec.connected) {
    return store.dispatch("global/loadFennecWalletAssets", {
      fennec: vue.$fennec,
    });
  } else {
    return store.dispatch("global/loadMixinWalletAssets");
  }
}

export async function loadWalletAsset(vue: Vue, assetId: string) {
  const store = vue.$store;
  if (vue.$fennec.connected) {
    return store.dispatch("global/loadFennecWalletAsset", {
      fennec: vue.$fennec,
      assetId,
    });
  } else {
    return store.dispatch("global/loadMixinWalletAsset", assetId);
  }
}
