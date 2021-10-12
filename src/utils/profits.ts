import { format, toPercent } from "@foxone/utils/number";

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
  const isCurve = pair.swap_method === "curve";

  let currentPrice = 0;
  if (isCurve) {
    currentPrice = 1;
  } else if (currentQuoteAmount !== 0) {
    currentPrice = currentBaseAmount / currentQuoteAmount;
  }

  // 以 base 计价的收益和收益率
  const baseProfit =
    currentBaseAmount +
    currentQuoteAmount * currentPrice -
    (netQuoteAmount * currentPrice + netBaseAmount);
  const baseProfitRate =
    netBaseAmount !== 0
      ? baseProfit / (netQuoteAmount * currentPrice + netBaseAmount)
      : 0;

  // 以 quote 计价的收益和收益率
  const quoteProfit =
    currentPrice !== 0
      ? currentQuoteAmount +
        currentBaseAmount / currentPrice -
        (netBaseAmount / currentPrice + netQuoteAmount)
      : 0;
  const quoteProfitRate =
    netQuoteAmount !== 0
      ? quoteProfit / (netBaseAmount / currentPrice + netQuoteAmount)
      : 0;

  // 以法币计价的收益和收益率
  const fiatProfit = baseValue + quoteValue - (netBaseValue + netQuoteValue);
  const fiatProfitRate =
    netBaseValue + netQuoteValue !== 0
      ? fiatProfit / (netBaseValue + netQuoteValue)
      : 0;

  // 不做市的情况下收益和收益率
  const basePrice = currentBaseAmount !== 0 ? baseValue / currentBaseAmount : 0;
  const quotePrice =
    currentQuoteAmount !== 0 ? quoteValue / currentQuoteAmount : 0;
  const originFiatProfit =
    netBaseAmount * basePrice +
    netQuoteAmount * quotePrice -
    (netBaseValue + netBaseValue);
  const originFiatProfitRate =
    netBaseValue + netQuoteValue !== 0
      ? originFiatProfit / (netBaseValue + netBaseValue)
      : 0;

  return {
    ts,
    origin: {
      netBaseAmount,
      netQuoteAmount,
      currentBaseAmount,
      currentQuoteAmount,
      netBaseValue,
      netQuoteValue,
      baseValue,
      quoteValue,
      baseProfit,
      fiatProfit,
      fiatProfitRate,
    },
    netBaseAmount: netBaseAmount + "",
    netQuoteAmount: netQuoteAmount + "",
    currentBaseAmount: format({ n: currentBaseAmount, dp: 8 }),
    currentQuoteAmount: format({ n: currentQuoteAmount, dp: 8 }),
    fiatProfit: format({ n: fiatProfit, dp: 2 }),
    originFiatProfit: format({ n: originFiatProfit, dp: 2 }),
    baseProfit: format({ n: baseProfit, dp: 8 }),
    quoteProfit: format({ n: quoteProfit, dp: 8 }),
    baseProfitRate: toPercent({ n: baseProfitRate, symbol: true }),
    baseProfitRateValue: baseProfitRate,
    quoteProfitRate: toPercent({ n: quoteProfitRate, symbol: true }),
    quoteProfitRateValue: quoteProfitRate,
    fiatProfitRate: toPercent({ n: fiatProfitRate, symbol: true }),
    fiatProfitRateValue: fiatProfitRate,
    originFiatProfitRate: toPercent({ n: originFiatProfitRate, symbol: true }),
    originFiatProfitRateValue: originFiatProfitRate,
  };
}
