import { getAvaliableAddAssets } from "@/utils/assets";
import { GetterTypes } from "./types";

export default {
  [GetterTypes.AVALIABLE_ADD_ASSETS](state) {
    const walletAssets: API.MixinAsset[] = state.account.assets;
    const assets: API.Asset[] = state.pool.assets;
    const assetsBlackLists: string[] = state.pool.assetsBlackLists;

    return getAvaliableAddAssets(assets, walletAssets, assetsBlackLists);
  },
};
