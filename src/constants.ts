import pkg from "../package.json";

export const IS_MTG = true;

export const VERSION = pkg.version;

export const TERMS_VERSION = "0.0.1";

export const MIXIN_HOST = "https://mixin-api.zeromesh.net";

export const DEFAULT_ASSET_ID = "c94ac88f-4671-3976-b60a-09064f1811e8";

export const BTC_ASSET_ID = "c6d0c728-2624-429b-8e0d-d9d19b6592fa";

export const CNB_ASSET_ID = "965e5c6e-434c-3fa9-b780-c50f43cd955c";

export const PRSID = "3edb734c-6d6f-32ff-ab03-4eb43640c758";

export const ETHID = "43d61dcd-e413-450d-80b8-101d5e903357";

export const EOSID = "6cfe566e-4aad-470b-8c9a-2fd35b49c68d";

export const PANDO_DOC = "https://docs.pando.im/docs/lake/intro";

export const SUP_CHART_SCHEMES = ["SCHEME_A", "SCHEME_B"];

export const CREATE_FEE = {
  amount: 0.2,
  asset_id: "43d61dcd-e413-450d-80b8-101d5e903357",
};

export const GLOBAL_EVENTS = {
  OPEN_PAYMENT_MODAL: "OPEN_PAYMENT_MODAL",
  OPEN_AUTH: "OPEN_AUTH",
  OPEN_TERMS_MODAL: "OPEN_TERMS_MODAL",
};
