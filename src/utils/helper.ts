import Vue from "vue";
import parse from "parse-duration";
import { GlobalGetters } from "~/store/types";

export function errorHandler(vm: Vue, error) {
  const code = error.code || "";

  let locale = "";
  if (code && vm.$t(`errorcode.${code}`) !== code) {
    locale = vm.$t(`errorcode.${code}`) as string;
  }

  const message = error.message || error.msg || locale || "Unknown Error";

  vm.$uikit.toast.error({ message: `${code} ${message}` });
}

export function getDurationData(
  data,
  duration,
  fn,
  size: number | undefined = undefined
) {
  const end = fn(data[data.length - 1]);
  let start = end - (parse(duration, "s") || 0);

  if (!start) {
    start = fn(data[0]);
  }

  return data
    .filter((x) => fn(x) >= start)
    .filter((x, index, array) => {
      if (!size) {
        return true;
      }

      const interval = Math.floor(array.length / size);

      if (interval === 0) {
        return true;
      }

      return (array.length - 1 - index) % interval === 0;
    });
}

export function useRedirectByPairPath(vm: Vue, action) {
  const getAssetBySymbol = vm.$store.getters[GlobalGetters.GET_ASSET_BY_SYMBOL];
  const path = vm.$route.params.path;
  const [baseSymbol = "", quoteSymbol = ""] = path.split("-");

  const baseAsset = getAssetBySymbol(baseSymbol);
  const quoteAsset = getAssetBySymbol(quoteSymbol);

  action({ baseAsset, quoteAsset });
}

export function useRedirectByAssetSymbol(vm: Vue, action) {
  const getAssetBySymbol = vm.$store.getters[GlobalGetters.GET_ASSET_BY_SYMBOL];
  const symbol = vm.$route.params.symbol;

  const asset = getAssetBySymbol(symbol);

  action({ asset });
}
