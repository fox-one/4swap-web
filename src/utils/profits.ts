import { toPrecision } from "@foxone/utils/number";
import BigNumber from "bignumber.js";

function divide(a, b) {
  return b !== 0 ? a / b : 0;
}

function getReverseData(isReverse, data) {
  let netBaseAmount = +data.nba;
  let netQuoteAmount = +data.nqa;
  let currentBaseAmount = +data.ba;
  let currentQuoteAmount = +data.qa;
  let netBaseValue = +data.nbv;
  let netQuoteValue = +data.nqv;
  let baseValue = +data.bv;
  let quoteValue = +data.qv;

  if (isReverse) {
    [
      netQuoteAmount,
      netBaseAmount,
      currentQuoteAmount,
      currentBaseAmount,
      netQuoteValue,
      netBaseValue,
      quoteValue,
      baseValue,
    ] = [
      netBaseAmount,
      netQuoteAmount,
      currentBaseAmount,
      currentQuoteAmount,
      netBaseValue,
      netQuoteValue,
      baseValue,
      quoteValue,
    ];
  }

  return {
    netQuoteAmount,
    netBaseAmount,
    currentQuoteAmount,
    currentBaseAmount,
    netQuoteValue,
    netBaseValue,
    quoteValue,
    baseValue,
  };
}

export function fmtProfits(
  vm: Vue,
  pair: API.Pair,
  data: API.ProfitsData
): API.PairProfits {
  const { isReverse } = vm.$utils.pair.getPairMeta(vm, pair)!;
  const {
    netQuoteAmount,
    netBaseAmount,
    currentQuoteAmount,
    currentBaseAmount,
    netQuoteValue,
    netBaseValue,
    quoteValue,
    baseValue,
  } = getReverseData(isReverse, data);

  const ts = data.ts;
  const netTotalValue = netBaseValue + netQuoteValue;
  const isCurve = pair.swap_method === "curve";

  const { baseProfit, baseProfitRate, quoteProfit, quoteProfitRate } = isCurve
    ? calcCurveProfits({
        currentBaseAmount,
        currentQuoteAmount,
        netBaseAmount,
        netQuoteAmount,
      })
    : calcProfits({
        currentBaseAmount,
        currentQuoteAmount,
        netBaseAmount,
        netQuoteAmount,
      });

  // 以法币计价的收益和收益率
  const fiatProfit = baseValue + quoteValue - netTotalValue;
  const fiatProfitRate = divide(fiatProfit, netTotalValue);

  // 不做市的情况下收益和收益率
  const basePrice = divide(baseValue, currentBaseAmount);
  const quotePrice = divide(quoteValue, currentQuoteAmount);

  const originFiatProfit =
    netBaseAmount * basePrice + netQuoteAmount * quotePrice - netTotalValue;
  const originFiatProfitRate = divide(originFiatProfit, netTotalValue);

  const format = (value: number, dp: number) => {
    return new BigNumber(toPrecision({ n: value, dp })).toNumber();
  };

  return {
    ts,
    origin: {
      netQuoteAmount,
      netBaseAmount,
      currentQuoteAmount,
      currentBaseAmount,
      netQuoteValue,
      netBaseValue,
      quoteValue,
      baseValue,
    },
    netBaseAmount: format(netBaseAmount, 8),
    netQuoteAmount: format(netQuoteAmount, 8),
    currentBaseAmount: format(currentBaseAmount, 8),
    currentQuoteAmount: format(currentQuoteAmount, 8),
    fiatProfit: format(fiatProfit, 8),
    originFiatProfit: format(originFiatProfit, 8),
    baseProfit: format(baseProfit, 8),
    quoteProfit: format(quoteProfit, 8),
    baseProfitRate: format(baseProfitRate, 4),
    quoteProfitRate: format(quoteProfitRate, 4),
    fiatProfitRate: format(fiatProfitRate, 4),
    originFiatProfitRate: format(originFiatProfitRate, 4),
  } as any;
}

/**
 * calc curve pair base and quote profts
 * curve pair has equal price rate 1 : 1
 *
 * ATTENTION: current application only support 1 : 1 curve rate,
 * if somehow 1 : N curve rate supported, this function should be rewrite
 *
 * @param {*} {
 *   currentBaseAmount,
 *   currentQuoteAmount,
 *   netBaseAmount,
 *   netQuoteAmount,
 * }
 * @return {*}
 */
function calcCurveProfits({
  currentBaseAmount,
  currentQuoteAmount,
  netBaseAmount,
  netQuoteAmount,
}) {
  const profit =
    currentBaseAmount + currentQuoteAmount - netBaseAmount - netQuoteAmount;
  const profitRate = divide(profit, netBaseAmount + netQuoteAmount);

  return {
    baseProfit: profit,
    baseProfitRate: profitRate,
    quoteProfit: profit,
    quoteProfitRate: profitRate,
  };
}

/**
 * calc normal pair profits
 *
 * @param {*} {
 *   currentBaseAmount,
 *   currentQuoteAmount,
 *   netBaseAmount,
 *   netQuoteAmount,
 * }
 * @return {*}
 */
function calcProfits({
  currentBaseAmount,
  currentQuoteAmount,
  netBaseAmount,
  netQuoteAmount,
}) {
  const currentPrice = divide(currentBaseAmount, currentQuoteAmount);

  // 以 base 计价的收益和收益率
  const baseAmountConverted = netBaseAmount + netQuoteAmount * currentPrice;
  const baseProfit = currentBaseAmount * 2 - baseAmountConverted;
  const baseProfitRate = divide(baseProfit, baseAmountConverted);

  // 以 quote 计价的收益和收益率
  const quoteAmountConverted =
    netQuoteAmount + divide(netBaseAmount, currentPrice);
  const quoteProfit = currentQuoteAmount * 2 - quoteAmountConverted;
  const quoteProfitRate = divide(quoteProfit, quoteAmountConverted);

  return { baseProfit, baseProfitRate, quoteProfit, quoteProfitRate };
}
