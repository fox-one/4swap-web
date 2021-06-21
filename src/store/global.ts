import Vue from "vue";
import { MutationTree, GetterTree, ActionTree } from "vuex";
import {
  IAsset,
  IFiat,
  IMixinAsset,
  IPair,
  IMixinUser,
  AppInfo,
} from "~/services/types/vo";
import { convertPairOrder } from "@/utils/pair/help";

const state = () => ({
  pairs: [],
  assets: [],
  fiats: [],
  walletAssets: [],
  cache: [],
  info: {
    fee_24h: null,
    volume_24h: null,
    pair_count: 0,
    transaction_count_24h: 0,
    ts: 0,
  },
  me: null,
  appInfo: null,
  test: "",
});

export type AssetsState = {
  pairs: IPair[];
  assets: IAsset[];
  fiats: IFiat[];
  walletAssets: IMixinAsset[];
  cache: string[];
  info: {
    fee_24h: string;
    volume_24h: string;
    pair_count: number;
    transaction_count_24h: number;
    ts: number;
  };
  me: IMixinUser | null;
  appInfo: AppInfo | null;
  liqSums: Array<number>;
  volSums: Array<number>;
  priceRatios: Array<number>;
  test: any;
};

const getters: GetterTree<AssetsState, any> = {
  getAssetsWithoutPairs(state) {
    const assets = state.assets;
    const pairs = state.pairs;
    return assets.filter((asset) => {
      let isPair = false;
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        if (
          pair.liquidity_asset_id === asset.id ||
          ~asset.name.indexOf("LP Token")
        ) {
          isPair = true;
          break;
        }
      }

      return !isPair;
    });
  },

  getAssetsJustInPairs(state) {
    const assets = state.assets;
    const pairs = state.pairs;
    return assets.filter((asset) => {
      let isInPairs = false;
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        if (
          (pair.base_asset_id === asset.id ||
            pair.quote_asset_id === asset.id) &&
          !~asset.name.indexOf("LP Token")
        ) {
          isInPairs = true;
          break;
        }
      }

      return isInPairs;
    });
  },

  getSortedAssets(state) {
    const cache = state.cache;
    return state.assets.concat().sort((a, b) => {
      const idxA = cache.indexOf(a.id);
      const idxB = cache.indexOf(b.id);
      return idxA > idxB ? -1 : idxA === idxB ? 0 : 1;
    });
  },

  getAssetById(state) {
    return (id) => {
      return state.assets.find((asset) => asset.id === id);
    };
  },

  getPairsById(state) {
    return (id) => {
      const pairs = state.pairs
        .filter((p) => {
          return p.base_asset_id === id || p.quote_asset_id === id;
        })
        .map((pair) => convertPairOrder(id, pair));

      return pairs;
    };
  },

  getBalanceByAssetId(state) {
    return (id) => {
      const asset = state.walletAssets.find((asset) => asset.asset_id === id);
      return asset?.balance ?? 0;
    };
  },

  getSharedPairs(state) {
    return state.pairs.filter((pair) => {
      const walletAsset = state.walletAssets.find(
        (asset) => asset.asset_id === pair.liquidity_asset_id
      );
      return Number(walletAsset?.balance) > 0;
    });
  },

  getPair(state) {
    return ({ base, quote }) => {
      const pair = state.pairs.find((p) => {
        const pair1 = p.base_asset_id === base && p.quote_asset_id === quote;
        const pair2 = p.base_asset_id === quote && p.quote_asset_id === base;
        return pair1 || pair2;
      });
      return pair && convertPairOrder(base, pair);
    };
  },

  getPairsAvaliable(state) {
    const diff = new Date().getTime() - state.info.ts;
    return diff < 1000 * 60;
  },

  getUserId(state) {
    return state.me?.user_id;
  },

  getUserInfo(state) {
    return state.me;
  },

  getUserTotalBalance(state) {
    let totalBal = 0;
    state.walletAssets.forEach((asset) => {
      totalBal += +asset.balance * +asset.price_usd;
    });
    return totalBal;
  },

  getUserLpBalance(state) {
    let totalBal = 0;
    state.walletAssets.forEach((asset) => {
      const found = state.pairs.find(
        (pair) => asset.asset_id === pair.liquidity_asset_id
      );
      if (found) {
        totalBal += +asset.balance * +asset.price_usd;
      }
    });
    return totalBal;
  },

  getPeriodData(state) {
    return {
      priceRatios: state.priceRatios,
      liqSums: state.liqSums,
      volSums: state.volSums,
    };
  },
};

const mutations: MutationTree<AssetsState> = {
  SET_PAIRS(state, pairs) {
    state.pairs = pairs;
  },

  SET_INFO(state, data) {
    state.info = {
      fee_24h: data.fee_24h,
      pair_count: data.pair_count,
      volume_24h: data.volume_24h,
      transaction_count_24h: data.transaction_count_24h,
      ts: data.ts,
    };
  },

  SET_VOL_SUMS(state, data) {
    state.volSums = data;
  },

  SET_LIQ_SUMS(state, data) {
    state.liqSums = data;
  },

  SET_PRICE_RATIOS(state, data) {
    state.priceRatios = data;
  },

  SET_APP_INFO(state, data) {
    state.appInfo = data;
  },

  SET_ASSETS(state, assets) {
    state.assets = assets.map((asset) => {
      return { ...asset, chainLogo: asset.chain?.logo ?? "" };
    });
  },

  SET_FIATS(state, fiats) {
    state.fiats = fiats;
  },

  SET_WALLET_ASSETS(state, walletAssets) {
    state.walletAssets = walletAssets || [];
  },

  MERGE_ASSET(state, walletAsset) {
    const index = state.walletAssets.findIndex(
      (asset) => asset.asset_id === walletAsset.asset_id
    );
    if (index > -1) {
      Vue.set(state.walletAssets, index, walletAsset || []);
    }
  },

  PUT_CACHE(state, key) {
    const cache = state.cache;
    const index = cache.indexOf(key);
    if (index > -1) {
      state.cache.splice(index, 1);
    } else if (cache.length >= 20) {
      state.cache.shift();
    }
    state.cache.push(key);
  },

  SET_ME(state, data) {
    state.me = data;
  },

  SET_TEST(state, data) {
    state.test = data;
  },
};

const actions: ActionTree<AssetsState, any> = {
  async syncLoadAssets({ state, dispatch }) {
    if (state.assets.length > 0) {
      dispatch("loadAssets");
    } else {
      await dispatch("loadAssets");
    }
  },

  async loadAssets({ commit }) {
    const res = await this.$http.getAssets();
    commit("SET_ASSETS", res.assets);
  },

  async loadFiats({ commit }, { token }) {
    const res = await this.$http.getFiats({ token });
    commit("SET_FIATS", res);
  },

  async loadMixinWalletAssets({ commit }) {
    const walletAssets = await this.$http.getAssetsFromMixin();
    commit("SET_WALLET_ASSETS", walletAssets);
  },

  async loadMixinWalletAsset({ commit }, id) {
    const asset = await this.$http.getAssetFromMixin(id);
    commit("MERGE_ASSET", asset);
  },

  async loadFennecWalletAssets({ commit }, { fennec }) {
    const walletAssets = await fennec?.getAssets();
    commit("SET_WALLET_ASSETS", walletAssets || []);
  },

  async loadFennecWalletAsset({ commit }, { fennec, assetId }) {
    const walletAsset = await fennec?.getAsset(assetId);
    if (walletAsset) {
      commit("MERGE_ASSET", walletAsset);
    }
  },

  async getAllAddedPairs({ commit }, { brokerId }) {
    const res = await this.$http.getPairs({ brokerId });
    const pairs = res.pairs || [];
    pairs.sort((a, b) => {
      const aLiquidity = Number(a.base_value) + Number(a.quote_value);
      const bLiquidity = Number(b.base_value) + Number(b.quote_value);
      return bLiquidity - aLiquidity;
    });
    this.$pairRoutes.makeRoutes(pairs);
    commit("SET_PAIRS", pairs);
    commit("SET_INFO", {
      fee_24h: res.fee_24h,
      volume_24h: res.volume_24h,
      pair_count: res.pair_count,
      transaction_count_24h: res.transaction_count_24h,
      ts: res.ts,
    });
  },

  async getMe({ commit }) {
    const res = await this.$http.getMe();
    commit("SET_ME", res);
  },

  async getAppInfo({ commit }) {
    const res = await this.$http.getAppInfo();
    commit("SET_APP_INFO", res);
  },

  clear({ commit }) {
    commit("SET_WALLET_ASSETS", []);
    commit("SET_ASSETS", []);
    commit("SET_PAIRS", []);
  },
};

export default {
  getters,
  state,
  mutations,
  actions,
};
