declare namespace API {
  export type TransactionType = "Swap" | "Add" | "Remove";

  export type GetTransactionsParams = {
    base: string;
    quote: string;
    type: string;
  } & API.PaginationParams;

  export interface GetTransactionParams {
    base: string;
    quote: string;
    follow: string;
  }

  export interface Transaction {
    amount: string;
    base_amount: string;
    base_asset_id: string;
    created_at: string;
    fee_amount: string;
    fee_asset_id: string;
    fee_value: string;
    filled_asset_id: string;
    funds: string;
    id: string;
    pay_asset_id: string;
    quote_amount: string;
    quote_asset_id: string;
    type: TransactionType;
    value: string;
    priceImpact?: number;
  }
}
