import { AddLQState } from "~/types";

/* eslint-disable camelcase */
export interface IAsset {
  chain: IChain;
  chain_id: string;
  chainLogo: string;
  id: string;
  logo: string;
  name: string;
  symbol: string;
  price: string;
  balance: string;
  display_symbol: string;
  promotion?: {
    label: string;
    url: string;
    color: string;
  };
}

export interface IFiat {
  code: string;
  rate: number;
}

export interface AppInfo {
  members: string[];
  threshold: number;
  public_key: string;
}

export interface IMixinAsset {
  asset_id: string;
  asset_key: string;
  balance: string;
  capitalization: number;
  chain_id: string;
  change_btc: string;
  change_usd: string;
  confirmations: number;
  destination: string;
  icon_url: string;
  mixin_id: string;
  name: string;
  price_btc: string;
  price_usd: string;
  reserve: string;
  symbol: string;
  tag: string;
  type: string;
}

export interface IMixinUser {
  accept_conversation_source: string;
  accept_search_source: string;
  avatar_url: string;
  biography: string;
  code_id: string;
  code_url: string;
  created_at: string;
  device_status: string;
  fiat_currency: string;
  full_name: string;
  has_emergency_contact: boolean;
  has_pin: boolean;
  identity_number: string;
  is_scam: boolean;
  is_verified: boolean;
  mute_until: string;
  phone: string;
  pin_token: string;
  receive_message_source: string;
  relationship: string;
  session_id: string;
  transfer_confirmation_threshold: number;
  transfer_notification_threshold: number;
  type: string;
  user_id: string;
}

export interface OpponentMultisig {
  receivers: string[];
  threshold: number;
}

export interface IMixinMulPaymentCodeParams {
  asset_id: string;
  amount: string;
  trace_id: string;
  opponent_multisig: OpponentMultisig;
  memo: string;
}

export interface IMixinMulPaymentCodeRsp {
  type: string;
  trace_id: string;
  asset_id: string;
  amount: string;
  threshold: number;
  receivers: string[];
  memo: string;
  created_at: string;
  status: string;
  code_id: string;
}

export interface ICreateAction {
  action: string;
  trace_id?: string;
  broker_id?: string;
  asset_id: string;
  amount: string;
}

export interface ICreateActionRsp {
  follow_id: string;
  action: string;
  code: string;
  code_url: string;
}

export interface IChain {
  chain_id: string;
  id: string;
  logo: string;
  name: string;
  symbol: string;
}

export interface IPair {
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
  liquidity_asset_id?: string;
  route_id: number;
  transaction_count_24h?: string;
}

export interface IDepositOrder {
  created_at: string;
  id: string;
  follow_id: string;
  state: AddLQState;
  user_id: string;
  base_asset_id: string;
  base_amount: string;
  quote_asset_id: string;
  quote_amount: string;
  slippage: string;
}

export interface IPairInfo {
  // 美元计价
  fee_24h: string;
  volume_24h: string;
  pair_count: number;
  transaction_count_24h: number;
}

export interface ITransaction {
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
  type: TxType;
  value: string;
  priceImpact?: number;
}

export enum TxType {
  Swap = "Swap",
  Add = "Add",
  Remove = "Remove",
}

export interface ISwapOrder {
  code: number | null | undefined;
  amount: string;
  created_at: string;
  fill_asset_id: string;
  funds: string;
  min_amount: string;
  pay_asset_id: string;
  route_assets: string[];
  routes: string;
  route_price: string;
  state: OrderState;
  transactions: ITransaction[];
}

export interface IPairsRes {
  pairs: API.Pair[];
  fee_24h: string;
  pair_count: number;
  transaction_count_24h: number;
  volume_24h: string;
  ts: number;
}

export enum OrderState {
  Trading = "Trading",
  Rejected = "Rejected",
  Done = "Done",
}
