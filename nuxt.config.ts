import { NuxtConfig } from "@nuxt/types";
import i18n from "./src/i18n";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const isProduct = process.env.APP_ENV === "prod";
const GA = process.env.GA;

const config: NuxtConfig = {
  ssr: false,
  router: {
    mode: "hash",
  },
  srcDir: "./src",
  head: {
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  loading: {
    color: "#eb70ab",
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
      "@nuxtjs/dotenv",
      { filename: isProduct ? ".env.production" : ".env.development" },
    ],
    [
      "nuxt-i18n",
      {
        vueI18n: i18n,
        locales: ["en", "zh"],
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
    id: GA,
    dev: false,
    debug: {
      enabled: !isProduct,
      sendHitTask: isProduct,
    },
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
  env: {
    TOKEN: process.env.TOKEN || "",
    SCOPE: process.env.SCOPE || "",
    APP_ENV: process.env.APP_ENV || "",
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
