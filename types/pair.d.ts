declare namespace API {
  export type PairSwapMethod = "" | "curve";

  export interface Pair {
    base_amount: string;
    base_asset_id: string;
    base_value: string;
    fee_24h: string;
    fee_percent: string;
    liquidity: string;
    quote_amount: string;
    quote_asset_id: string;
    quote_value: string;
    volume_24h: string;
    share?: string;
    liquidity_asset_id?: string;
    shares: Shares;
    route_id: number;
    transaction_count_24h?: string;
    swap_method?: PairSwapMethod;
  }

  export interface Shares {
    base_asset_id: string;
    quote_asset_id: string;
    base_amount: string;
    quote_amount: string;
    add_base_amount: string;
    add_quote_amount: string;
    remove_base_amount: string;
    remove_quote_amount: string;
    liquidity: string;
    percent: string;
  }

  export interface PairInfo {
    fee_24h: string;
    volume_24h: string;
    pair_count: number;
    transaction_count_24h: number;
  }

  export interface PairsRes {
    pairs: API.Pair[];
    fee_24h: string;
    pair_count: number;
    transaction_count_24h: number;
    volume_24h: string;
    ts: number;
  }
}
