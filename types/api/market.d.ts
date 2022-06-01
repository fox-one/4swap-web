declare namespace API {
  export type Duration = "24h" | "168h" | "720h" | "4320h";

  export interface PaginationParams {
    limit: string | number;
    cursor: string;
  }

  export interface GetMarketDataParams {
    base: string;
    quote: string;
    dur: API.Duration;
  }

  export interface GetKlineDataParams {
    base: string;
    quote: string;
    dur: API.Duration;
  }

  export interface GetProfitsParams {
    base: string;
    quote: string;
  }

  export interface GetProfitsHistoryParams {
    base: string;
    quote: string;
    dur: API.Duration;
  }

  export interface MarketData {
    ts: number;
    date: string;
    value: string;
    volume: string;
  }

  // 159928560 time
  // "62.8199367", base_open
  // "62.8199367", base_close
  // "0.01591851", quote_open
  // "0.01591851" quote_close
  export type KlineData = [number, string, string, string, string];

  export interface ProfitsData {
    ts: number;
    date: string;
    nba: string; // 净注入 base 数量
    nbv: string; // 净注入 base 成本（USD）
    nqa: string; // 净注入 quote 数量
    nqv: string; // 净注入 quote 成本 (USD)
    nl: string; // 净流动性
    ba: string; // 当前 base 数量
    bv: string; // 当前 base 市值（USD）
    qa: string; // 当前 quote 数量
    qv: string; // 当前 quote 市值（USD）
  }

  export interface PairProfits {
    ts: number;
    netBaseAmount: number;
    netQuoteAmount: number;
    currentBaseAmount: number;
    currentQuoteAmount: number;
    baseProfit: number;
    quoteProfit: number;
    baseProfitRate: number;
    quoteProfitRate: number;
    fiatProfitRate: number;
    originFiatProfitRate: number;
    fiatProfit: number;
    originFiatProfit: number;
  }
}
