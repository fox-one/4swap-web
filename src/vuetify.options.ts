import zh from "vuetify/es5/locale/zh-Hans";
import en from "vuetify/es5/locale/en";
import ja from "vuetify/es5/locale/ja";
import enUIKit from "@foxone/uikit/src/locales/en";
import jaUIKit from "@foxone/uikit/src/locales/ja";
import zhUIKit from "@foxone/uikit/src/locales/zh-Hans";

const locales = {
  zh: { ...zh, ...zhUIKit },
  en: { ...en, ...enUIKit },
  ja: { ...ja, ...jaUIKit },
};

const icons = {
  iconfont: "mdiSvg",
  values: {
    IconChevron: {
      component: "icon-chevron",
    },
    iconSwitch: {
      component: "icon-switch",
    },
    iconPlus: {
      component: "icon-plus",
    },
    iconInfo: {
      component: "icon-info",
    },
    iconRemove: {
      component: "icon-remove",
    },
    iconNavMe: {
      component: "icon-nav-me",
    },
    iconNavPool: {
      component: "icon-nav-pool",
    },
    iconNavSwap: {
      component: "icon-nav-swap",
    },
    iconX: {
      component: "icon-x",
    },
    iconRefresh: {
      component: "icon-refresh",
    },
    iconTriangle: {
      component: "icon-triangle",
    },
    IconRoute: {
      component: "icon-route",
    },
  },
};

export default function ({ store }) {
  const isDark = store.state.app.dark;

  return {
    icons,
    lang: { locales },
    theme: {
      dark: isDark,
      options: {
        customProperties: true,
      },
      themes: {
        light: {
          primary: "#ee4596",
          accent: "#ee4596",
          // greyscale
          greyscale_1: "#000000",
          greyscale_2: "#333333",
          greyscale_3: "#666666",
          greyscale_4: "#cccccc",
          greyscale_5: "#ebebeb",
          greyscale_6: "#f5f5f5",
          // error & warning
          error: "#f44c4c",
          success: "#00c7af",
          warning: "#FC8A22",
          // general color
          yellow: "#fadf8b",
          purple: "#c699e6",
          blue: "#7cadfa",
          gray: "#b9b9bc",
          green: "#9ddc95",
          red: "#f39086",
        },
        dark: {
          primary: "#f16aab",
          accent: "#f16aab",
          // greyscale
          greyscale_1: "#ffffff",
          greyscale_2: "#d2d3d3",
          greyscale_3: "#9b9c9d",
          greyscale_4: "#636466",
          greyscale_5: "#36383b",
          greyscale_6: "#191919",
          // error & warning
          error: "#f67070",
          success: "#33d2bf",
          warning: "#FC8A22",
          // general color
          yellow: "#d8ba44",
          purple: "#9d5bcb",
          blue: "#3476d6",
          gray: "#87868a",
          green: "#61b756",
          red: "#ce4d40",
        },
      },
    },
  };
}
