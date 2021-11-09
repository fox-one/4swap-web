import { toPrecision } from "@foxone/utils/number";
import BigNumber from "bignumber.js";

function divide(a, b) {
  return b !== 0 ? a / b : 0;
}

export function fmtProfits(
  pair: API.Pair,
  data: API.ProfitsData
): API.PairProfits {
  const netBaseAmount = +data.nba;
  const netQuoteAmount = +data.nqa;
  const currentBaseAmount = +data.ba;
  const currentQuoteAmount = +data.qa;
  const netBaseValue = +data.nbv;
  const netQuoteValue = +data.nqv;
  const baseValue = +data.bv;
  const quoteValue = +data.qv;
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
 * since price = BaseAmount / QuoteAmount
 * so any side added the opposite changed to is equal to the side value * 2
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
  // 以 base 计价的收益和收益率
  const baseProfit = (currentBaseAmount - netBaseAmount) * 2;
  const baseProfitRate = divide(baseProfit, netBaseAmount * 2);

  // 以 quote 计价的收益和收益率
  const quoteProfit = (currentQuoteAmount - netQuoteAmount) * 2;
  const quoteProfitRate = divide(quoteProfit, netQuoteAmount * 2);

  return { baseProfit, baseProfitRate, quoteProfit, quoteProfitRate };
}
