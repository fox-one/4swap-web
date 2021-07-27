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
    iconChevronDown: {
      component: "icon-chevron-down",
    },
    iconPandoLake: {
      component: "icon-pando-lake",
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

export default function ({ store, $config }) {
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
          primary: $config.PRIMARY_COLOR_LIGHT,
          accent: $config.PRIMARY_COLOR_LIGHT,
          // greyscale
          greyscale_1: "#000000",
          greyscale_2: "#494949",
          greyscale_3: "#808080",
          greyscale_4: "#CCCCCC",
          greyscale_5: "#EBEBEB",
          greyscale_6: "#F5F5F5",
          greyscale_7: "#FFFFFF",
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
          primary: $config.PRIMARY_COLOR_DARK,
          accent: $config.PRIMARY_COLOR_DARK,
          // greyscale
          greyscale_1: "#FFFFFF",
          greyscale_2: "#D8D8D8",
          greyscale_3: "#9F9F9F",
          greyscale_4: "#656565",
          greyscale_5: "#3C3C3C",
          greyscale_6: "#191919",
          greyscale_7: "#000000",
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
