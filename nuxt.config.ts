import { NuxtConfig } from "@nuxt/types";
import i18n from "./src/i18n";

const config: NuxtConfig = {
  ssr: false,
  router: {
    mode: "hash",
  },
  srcDir: "./src",
  head: {
    title: process.env.CHANNEL_NAME,
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
      },
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: `/${process.env.CHANNEL}.png`,
      },
    ],
  },
  loading: {
    color: process.env.LOADING_COLOR,
  },
  css: ["~/styles/index.scss"],
  plugins: [
    "~/plugins/persistedstate.ts",
    "~/plugins/components.ts",
    "~/plugins/property.ts",
    "~/plugins/lib.ts",
  ],
  buildModules: [
    "@nuxtjs/eslint-module",
    [
      "@nuxt/typescript-build",
      {
        typeCheck: true,
        ignoreNotFoundWarnings: true,
      },
    ],
    "@nuxtjs/vuetify",
  ],
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/google-analytics",
    [
      "nuxt-i18n",
      {
        vueI18n: i18n,
        locales: ["en", "zh", "ja"],
        defaultLocale: "en",
        strategy: "no_prefix",
        detectBrowserLanguage: false,
        parsePages: false,
        seo: false,
      },
    ],
    "@nuxtjs/pwa",
  ],
  googleAnalytics: {
    id: process.env.GA,
    dev: false,
  },
  vuetify: {
    customVariables: ["~/styles/_variables.scss"],
    defaultAssets: false,
    treeShake: true,
    optionsPath: "./vuetify.options.ts",
  },
  build: {
    transpile: ["vuetify", "@foxone/uikit"],
  },

  publicRuntimeConfig: {
    CHANNEL: process.env.CHANNEL || "",
    CHANNEL_NAME: process.env.CHANNEL_NAME || "",
    PRIMARY_COLOR_DARK: process.env.PRIMARY_COLOR_DARK || "",
    PRIMARY_COLOR_LIGHT: process.env.PRIMARY_COLOR_LIGHT || "",
    BROKER_ID: process.env.BROKER_ID || "",

    API_BASE: process.env.API_BASE || "",
    WS_BASE: process.env.WS_BASE || "",
    MIXIN_CLIENT_ID: process.env.MIXIN_CLIENT_ID || "",
    FIAT_TOKEN: process.env.FIAT_TOKEN || "",
    GA: process.env.GA || "",

    LEGACY_WEB_HOST: process.env.LEGACY_WEB_HOST || "",
    MTG_WEB_HOST: process.env.MTG_WEB_HOST || "",
  },

  privateRuntimeConfig: {
    TOKEN: process.env.TOKEN || "",
    SCOPE: process.env.SCOPE || "",
  },

  pwa: {
    workbox: {
      enabled: false,
      runtimeCaching: [
        {
          urlPattern: /^(https:\/\/images\.mixin\.one\/|https:\/\/mixin-images\.zeromesh\.net\/).*$/,
          handler: "CacheFirst",
        },
      ],
    },
  },
};

export default config;
