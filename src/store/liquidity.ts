import { MutationTree } from "vuex";
import { IAsset } from "~/services/types/vo";
import { DepositParams } from "@/utils/payment";

const state = () => ({
  baseAsset: null,
  quoteAsset: null,
  deposits: [],
});

export type SwapState = {
  baseAsset: IAsset | null;
  quoteAsset: IAsset | null;
  deposits: DepositParams[];
};

const mutations: MutationTree<SwapState> = {
  SET_BASE_ASSET(state, data) {
    state.baseAsset = data;
  },
  SET_QUOTE_ASSET(state, data) {
    state.quoteAsset = data;
  },
  SET_DEPOSITS(state, data) {
    state.deposits = data;
  },
};

export default {
  state,
  mutations,
};
