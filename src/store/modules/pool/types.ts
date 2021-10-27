export const prefix = "pool/";

export const MutationTypes = {
  PUT_CACHE: "PUT_CACHE",
  SET_ASSETS: "SET_ASSETS",
  SET_PAIRS: "SET_PAIRS",
  SET_ASSETS_WHITE_LISTS: "SET_ASSETS_WHITE_LISTS",
  SET_FIATS: "SET_FIATS",
};

export const ActionTypes = {
  LOAD_POOL_ASSETS: "LOAD_POOL_ASSETS",
  LOAD_FIATS: "LOAD_FIATS",
  LOAD_POOL_PAIRS: "LOAD_PAIRS",
};

export const GetterTypes = {
  POOL_OVERVIEW: "POOL_OVERVIEW",
  AVALIABLE_ASSETS: "AVALIABLE_ASSETS",
  AVALIABLE_PAIRS: "AVALIABLE_PAIRS",
  AVALIABLE_SWAP_ASSETS: "AVALIABLE_SWAP_ASSETS",
  GET_ASSET_BY_ID: "GET_ASSET_BY_ID",
  GET_PAIR_BY_IDS: "GET_PAIR_BY_IDS",
  GET_PAIR_BY_LIQUIDIY_ID: "GET_PAIR_BY_LIQUIDIY_ID",
};
