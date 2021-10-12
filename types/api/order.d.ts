declare namespace API {
  export type AddLQState = "Pending" | "Cancelled" | "Done";

  export type TransferState = "Pending" | "Paid";

  export type SwapOrderState = "Trading" | "Rejected" | "Done";

  export interface RequestDepositParams {
    base: string;
    quote: string;
    data: any;
  }

  export interface DepositOrder {
    created_at: string;
    id: string;
    state: AddLQState;
    transfers: Transfer[];
    user_id: string;
    base_asset_id?: string;
    base_amount?: string;
    quote_asset_id?: string;
    quote_amount?: string;
  }

  export interface SwapOrder {
    code: number | null | undefined;
    pay_amount: string;
    created_at: string;
    fill_asset_id: string;
    fill_amount: string;
    min_amount: string;
    amount?: string;
    funds?: string;
    pay_asset_id: string;
    route_assets: string[];
    routes: string;
    route_price: string;
    state: SwapOrderState;
    transactions: Transaction[];
    price_impact?: number;
  }

  export interface Transfer {
    amount: string;
    asset_id: string;
    memo: string;
    opponent_id: string;
    trace_id: string;
    status: TransferState;
  }

  export interface PreOrderParams {
    funds?: string | null;
    fill_asset_id: string;
    pay_asset_id: string;
    amount?: string | null;
    messageId?: string | null;
  }
}
