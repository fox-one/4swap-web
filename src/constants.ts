import pkg from "../package.json";

export const IS_MTG = true;

export const VERSION = pkg.version;

export const isProduct = process.env.APP_ENV === "prod";

export const NODE_ENV = process.env.NODE_ENV;

export const APP_TOKEN = process.env.TOKEN;

export const APP_SCOPE = process.env.SCOPE;

export const CONFIG = {
  API_BASE: process.env.API_BASE,
  LEGACY_WEB_HOST: process.env.LEGACY_WEB_HOST,
  MTG_WEB_HOST: process.env.MTG_WEB_HOST,
  MIXIN_CLIENT_ID: process.env.MIXIN_CLIENT_ID,
  WS_BASE: process.env.WS_BASE,
};

export const FIAT_TOKEN = process.env.FIAT_TOKEN;

export const GA = process.env.GA;

export const MIXIN_HOST = "https://mixin-api.zeromesh.net";

export const DEFAULT_ASSET_ID = "c94ac88f-4671-3976-b60a-09064f1811e8";

export const BTC_ASSET_ID = "c6d0c728-2624-429b-8e0d-d9d19b6592fa";

export const CNB_ASSET_ID = "965e5c6e-434c-3fa9-b780-c50f43cd955c";

export const REMOVE_ASSET_ID = CNB_ASSET_ID;

export const SUP_CURRENCY = ["CNY", "JPY", "USD"];

export const CURRENCY = {
  CNY: { id: "CNY", precision: 2, unit: "人民币", symbol: "¥" },
  JPY: { id: "JPY", precision: 0, unit: "日本円", symbol: "¥" },
  USD: { id: "USD", precision: 2, unit: "US Dollar", symbol: "$" },
};

export const SUP_CHART_SCHEMES = ["SCHEME_A", "SCHEME_B"];
export const CHART_SCHEMES = {
  SCHEME_A: { id: "SCHEME_A", up: "#63cb49", down: "#eb4880" },
  SCHEME_B: { id: "SCHEME_B", up: "#eb4880", down: "#63cb49" },
};

export const PRSID = "3edb734c-6d6f-32ff-ab03-4eb43640c758";
