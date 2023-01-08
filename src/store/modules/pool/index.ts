import { make } from "vuex-pathify";
import { MutationTypes, ActionTypes, GetterTypes } from "./types";
import { HIDE_ASSET_LIST, BLACK_ASSET_LIST } from "@/constants";
import { updateCache } from "@/utils/cache";
import BigNumber from "bignumber.js";

import type { ActionTree } from "vuex";

const state: State.PoolState = {
  pairs: [],
  assets: [],
  multisigAssets: [],
  assetsWhiteLists: [],
  assetsBlackLists: BLACK_ASSET_LIST,
  assetsHideLists: HIDE_ASSET_LIST,
  fiats: [],
  cache: [],
  loading: false,
};

const mutations = {
  ...make.mutations(state),

  [MutationTypes.SET_POOL_LOADING](state, value) {
    state.loading = value;
  },

  [MutationTypes.PUT_CACHE](state, key) {
    updateCache(state.cache, key);
  },
};

const getters = {
  // filter assets by whitelist and blacklist
  [GetterTypes.AVALIABLE_ASSETS](state) {
    const {
      assets,
      assetsWhiteLists: whitelists,
      assetsBlackLists: blacklists,
    } = state;
    let avaliables: API.Asset[] = assets;

    //  use asset only listed in whitelist
    if (whitelists.length) {
      avaliables = avaliables.filter(({ id }) =>
        whitelists.find((x) => id === x)
      );
    }

    // remove asset listed in blacklist
    if (blacklists.length) {
      avaliables = avaliables.filter(
        ({ id }) => !blacklists.find((x) => id === x)
      );
    }

    return avaliables;
  },

  // pair which can be swap
  [GetterTypes.AVALIABLE_SWAP_PAIRS](state, getters) {
    const pairs = state.pairs;
    const assets = getters[GetterTypes.AVALIABLE_ASSETS];

    return pairs.filter(({ base_asset_id, quote_asset_id }) => {
      return (
        assets.find(({ id }) => id === base_asset_id) &&
        assets.find(({ id }) => id === quote_asset_id)
      );
    });
  },

  // pairs which can be calculated liquidity (visiable in pair list)
  [GetterTypes.AVALIABLE_CALC_PAIRS](state, getters) {
    const pairs = state.pairs;
    const { assetsHideLists: hidelists } = state;

    let assets: API.Asset[] = getters[GetterTypes.AVALIABLE_ASSETS];

    assets = assets.filter(({ id }) => !hidelists.find((x) => id === x));

    return pairs.filter(({ base_asset_id, quote_asset_id }) => {
      return (
        assets.find(({ id }) => id === base_asset_id) &&
        assets.find(({ id }) => id === quote_asset_id)
      );
    });
  },

  // assets which can be calculated (visiable asset list)
  [GetterTypes.AVALIABLE_CALC_ASSETS_META](state, getters) {
    const pairs: API.Pair[] = getters[GetterTypes.AVALIABLE_CALC_PAIRS];
    const empty = { liquidity: 0, volume_24h: 0, liquidity_amount: 0 };
    const assetMap = new Map<string, typeof empty>();

    pairs.forEach((pair) => {
      const {
        base_asset_id,
        quote_asset_id,
        base_amount,
        base_value,
        quote_amount,
        quote_value,
        volume_24h,
      } = pair;
      const baseRecord = assetMap.get(base_asset_id) || empty;
      const quoteRecord = assetMap.get(quote_asset_id) || empty;

      assetMap.set(base_asset_id, {
        liquidity: baseRecord.liquidity + +base_value,
        liquidity_amount: baseRecord.liquidity_amount + +base_amount,
        volume_24h: baseRecord.volume_24h + +volume_24h,
      });
      assetMap.set(quote_asset_id, {
        liquidity: quoteRecord.liquidity + +quote_value,
        liquidity_amount: baseRecord.liquidity_amount + +quote_amount,
        volume_24h: quoteRecord.volume_24h + +volume_24h,
      });
    });

    return Array.from(assetMap).map(([id, data]) => {
      const asset = getters[GetterTypes.GET_ASSET_BY_ID](id);

      return {
        name: asset.name,
        id: asset.id,
        symbol: asset.symbol,
        chain_logo: asset.chainLogo,
        logo: asset.logo,
        price: +asset.price,
        ...data,
      };
    });
  },

  // only assets appear in avaliable swap pairs can be swapped
  [GetterTypes.AVALIABLE_SWAP_ASSETS](state, getters) {
    const assets: API.Asset[] = getters[GetterTypes.AVALIABLE_ASSETS];
    const avaliablePairs: API.Pair[] =
      getters[GetterTypes.AVALIABLE_SWAP_PAIRS];

    const set = new Set<string>();
    const map = new Map<string, API.Asset>();

    assets.forEach((x) => {
      map.set(x.id, x);
    });

    avaliablePairs.forEach((x) => {
      set.add(x.base_asset_id);
      set.add(x.quote_asset_id);
    });

    const avaliableAssets = Array.from(set).map((x) => map.get(x));
    const cache = state.cache.concat().reverse();

    return avaliableAssets.concat().sort((a, b) => {
      const idxA = cache.indexOf(a?.id);
      const idxB = cache.indexOf(b?.id);

      return idxA > idxB ? -1 : idxA === idxB ? 0 : 1;
    });
  },

  [GetterTypes.POOL_OVERVIEW](_, getters) {
    const pairs = getters[GetterTypes.AVALIABLE_CALC_PAIRS];
    const { totalUSDValue, volume24h, fee24h, transactions } = pairs.reduce(
      ({ totalUSDValue, volume24h, fee24h, transactions }, p) => {
        return {
          totalUSDValue: totalUSDValue
            .plus(p.base_value ?? 0)
            .plus(p.quote_value ?? 0),
          volume24h: volume24h.plus(p.volume_24h ?? 0),
          fee24h: fee24h.plus(p.fee_24h ?? 0),
          transactions: transactions.plus(p.transaction_count_24h ?? 0),
        };
      },
      {
        totalUSDValue: new BigNumber(0),
        volume24h: new BigNumber(0),
        fee24h: new BigNumber(0),
        transactions: new BigNumber(0),
      }
    );
    const turnover24h = volume24h / totalUSDValue;

    return { totalUSDValue, volume24h, fee24h, transactions, turnover24h };
  },

  [GetterTypes.GET_ASSET_BY_ID](state) {
    return (id: string) => state.assets.find((x) => x.id === id);
  },

  [GetterTypes.GET_ASSET_BY_SYMBOL](state) {
    return (symbol: string) => {
      return state.assets.find((x) => {
        return [
          x.symbol.toLowerCase(),
          x.display_symbol?.toLowerCase(),
        ].includes(symbol.toLowerCase());
      });
    };
  },

  [GetterTypes.GET_PAIR_BY_IDS](state) {
    return (id1: string, id2: string) => {
      // pair's base id is smaller than quote id
      const [base, quote] = id1 < id2 ? [id1, id2] : [id2, id1];

      return state.pairs.find(({ base_asset_id, quote_asset_id }) => {
        return base === base_asset_id && quote === quote_asset_id;
      });
    };
  },

  [GetterTypes.GET_PAIR_BY_LIQUIDIY_ID](state) {
    return (id: string) => {
      return state.pairs.find(({ liquidity_asset_id }) => {
        return liquidity_asset_id === id;
      });
    };
  },

  [GetterTypes.GET_PAIRS_BY_ASSET](state, getters) {
    const pairs = getters[GetterTypes.AVALIABLE_SWAP_PAIRS];

    return (id: string) => {
      return pairs.filter((x) => {
        return x.base_asset_id === id || x.quote_asset_id === id;
      });
    };
  },
};

const actions: ActionTree<State.PoolState, any> = {
  async [ActionTypes.LOAD_POOL_DATA](
    { commit, state, dispatch },
    { brokerId }
  ) {
    commit(MutationTypes.SET_POOL_LOADING, true);

    const syncActions: Promise<any>[] = [
      dispatch(ActionTypes.LOAD_POOL_PAIRS, { brokerId }),
    ];

    const loadFiatsAction = dispatch(ActionTypes.LOAD_FIATS);
    if (!state.fiats.length) {
      syncActions.push(loadFiatsAction);
    }

    const loadAssetsAction = dispatch(ActionTypes.LOAD_POOL_ASSETS);
    if (!state.assets.length) {
      syncActions.push(loadAssetsAction);
    }

    const loadMultisigAssetsAction = dispatch(ActionTypes.LOAD_MULTISIG_ASSETS);
    if (!state.multisigAssets.length) {
      syncActions.push(loadMultisigAssetsAction);
    }

    await Promise.all(syncActions);

    commit(MutationTypes.SET_POOL_LOADING, false);
  },

  async [ActionTypes.LOAD_POOL_ASSETS]({ commit }) {
    const resp = await this.$http.getAssets();

    commit(
      MutationTypes.SET_ASSETS,
      resp.assets.map((x) => ({
        ...x,
        chainLogo: x.chain.logo,
      }))
    );
  },

  async [ActionTypes.LOAD_MULTISIG_ASSETS]({ commit }) {
    const resp = await this.$http.getMultiSigAssets();

    commit(MutationTypes.SET_MULTISIG_ASSETS, resp);
  },

  async [ActionTypes.LOAD_FIATS]({ commit }) {
    const resp = await this.$http.getFiats();

    commit(MutationTypes.SET_FIATS, resp);
  },

  async [ActionTypes.LOAD_POOL_PAIRS]({ commit }, { brokerId }) {
    const resp = await this.$http.getPairs({ brokerId });
    const pairs = resp?.pairs ?? [];

    if (pairs.length > 0) {
      commit(MutationTypes.SET_PAIRS, pairs);
      commit(MutationTypes.SET_ASSETS_WHITE_LISTS, resp.whitelists ?? []);

      this.$pairRoutes.makeRoutes(pairs);
    }
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
