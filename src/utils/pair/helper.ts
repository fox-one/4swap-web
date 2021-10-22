import { GlobalGetters } from "@/store/types";
import { format } from "@foxone/utils/number";

export type PairMeta = ReturnType<typeof getPairMeta>;

/**
 * get pair meta items
 * base and quote should be ajusted by priorities
 * finally order is decide by params reverse and priorities
 *
 * @export
 * @param {Vue} vm
 * @param {API.Pair} pair
 * @param {boolean} [reverse=false]
 * @return {*}
 */
export function getPairMeta(vm: Vue, pair: API.Pair, reverse = false) {
  const getAssetById = vm.$store.getters[GlobalGetters.GET_ASSET_BY_ID];
  const priorities = ["XIN", "ETH", "BTC", "DAI", "USDC", "pUSD", "USDT"];

  const baseAsset: API.Asset = getAssetById(pair.base_asset_id);
  const quoteAsset: API.Asset = getAssetById(pair.quote_asset_id);
  const baseIndex = priorities.findIndex((x) => x === baseAsset?.symbol);
  const quoteIndex = priorities.findIndex((x) => x === quoteAsset?.symbol);

  // reverse or not is decide by params and priorities
  const isReverse = quoteIndex < baseIndex !== reverse;

  const sorted = isReverse
    ? { baseAsset: quoteAsset, quoteAsset: baseAsset, ...getReversePair(pair) }
    : { baseAsset, quoteAsset, ...pair };
  const price = +sorted.quote_amount / +sorted.base_amount;
  const symbol = `${sorted.baseAsset.symbol} / ${sorted.quoteAsset.symbol}`;
  const volume = +pair.quote_value + +pair.base_value;
  const turnOver = (volume && +pair.volume_24h / +volume) || 0;

  // price format
  const baseSymbol = sorted.baseAsset.symbol;
  const quoteSymbol = sorted.quoteAsset.symbol;

  const priceFormat = format({ n: price, fixed: true });
  const reversePriceFormat = format({ n: 1 / price, fixed: true });
  const priceText = `1 ${baseSymbol} ≈ ${priceFormat} ${quoteSymbol}`;
  const reversePriceText = `1 ${quoteSymbol} ≈ ${reversePriceFormat} ${baseSymbol}`;

  return {
    ...sorted,
    price,
    symbol,
    volume,
    turnOver,
    isReverse,
    priceText,
    reversePriceText,
  };
}

/**
 * switch base and quote asset data
 *
 * @export
 * @param {API.Pair} pair
 * @return {*}
 */
export function getReversePair(pair: API.Pair) {
  return {
    ...pair,
    base_amount: pair.quote_amount,
    base_asset_id: pair.quote_asset_id,
    base_value: pair.quote_value,
    quote_amount: pair.base_amount,
    quote_asset_id: pair.base_asset_id,
    quote_value: pair.base_value,
  };
}

/**
 * calc price, fee, min receive... by prediction order
 *
 * @export
 * @param {Vue} vm
 * @param {{
 *     input: API.Asset;
 *     output: API.Asset;
 *     order: API.SwapOrder;
 *   }} {
 *     input,
 *     output,
 *     order,
 *   }
 * @return {*}
 */
export function getPreOrderMeta(
  vm: Vue,
  {
    input,
    output,
    order,
  }: {
    input: API.Asset;
    output: API.Asset;
    order: API.SwapOrder;
  }
) {
  const format = vm.$utils.number.format;
  const getPairByIds = vm.$store.getters[GlobalGetters.GET_PAIR_BY_IDS];

  const inputSymbol = input.symbol;
  const outputSymbol = output.symbol;
  const slippage = vm.$store.state.app.settings.slippage || 0.99;
  const { amount = 0, funds = 0, route_assets = [] } = order;

  // calc price and reverse price text
  let price = "";
  let priceText = "";
  let reversePrice = "";
  let reversePriceText = "";

  if (amount && funds) {
    price = (+amount / +funds).toString();
    reversePrice = (+funds / +amount).toString();
    priceText = `1 ${inputSymbol} ≈ ${format({ n: price })} ${outputSymbol}`;
    reversePriceText = `1 ${outputSymbol} ≈ ${format({
      n: reversePrice,
    })} ${inputSymbol}`;
  }

  // calc fee and fee text
  let fee = 0;
  let feeText = "";
  let receivePercent = 1;

  route_assets.forEach((asset, index) => {
    const pair = getPairByIds({
      base: asset,
      quote: route_assets?.[index + 1],
    });

    receivePercent *= 1 - (pair?.fee_percent ?? 0);
  });

  fee = +funds - receivePercent * +funds;
  feeText = format({ n: fee, dp: 8 });

  // calc min recevied
  const minReceived = +amount * +slippage;
  const minReceivedText = format({ n: minReceived });

  return {
    ...order,
    price,
    priceText,
    reversePrice,
    reversePriceText,
    fee,
    feeText,
    minReceived,
    minReceivedText,
  };
}

/**
 * filter pair by given filter string
 *
 * @export
 * @param {string} str
 * @param {PairMeta} pair
 * @return {*}
 */
export function filterFn(str: string, pair: PairMeta) {
  const baseSymbol = pair.baseAsset.symbol.toLowerCase();
  const quoteSymbol = pair.quoteAsset.symbol.toLowerCase();
  const pairSymbol = pair.symbol.toLowerCase();
  const filter = str.toLowerCase();

  if (!str) return false;

  return (
    baseSymbol.includes(filter) ||
    quoteSymbol.includes(filter) ||
    pairSymbol.includes(filter)
  );
}
