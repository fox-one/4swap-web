import Vue from "vue";

export function errorHandler(
  vm: Vue,
  error: {
    status?: number;
    message?: string;
    msg?: string;
    code?: string | number;
  }
) {
  const code = error.code;

  let locale = "";
  if (code && vm.$t(`errorcode.${code}`) !== code) {
    locale = vm.$t(`errorcode.${code}`) as string;
  }

  const message = error.message || error.msg || locale || "Unknown Error";

  vm.$uikit.toast.error({ message: `${code} ${message}` });
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

export function getLangCode(value) {
  const data = {
    zh: "zh-CN",
    ja: "ja-JP",
    en: "en-US",
  };

  return data[value];
}
