declare namespace API {
  export interface DepositParams {
    amount: string;
    asset_id: string;
    follow_id: string;
    trace_id: string;
    opposite_asset_id: string;
  }

  export interface SwapParams {
    minimum: string;
    routes: string;
    pay_asset_id: string;
    fill_asset_id: string;
    follow_id: string;
    amount: string;
  }

  export interface RemoveParams {
    amount: string;
    asset_id: string;
    follow_id: string;
  }

  export interface OpponentMultisig {
    receivers: string[];
    threshold: number;
  }

  export interface MixinMulPaymentCodeParams {
    asset_id: string;
    amount: string;
    trace_id: string;
    opponent_multisig: OpponentMultisig;
    memo: string;
  }

  export interface MixinMulPaymentCodeRsp {
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

  export interface CreateAction {
    action: string;
    trace_id?: string;
    broker_id?: string;
    asset_id: string;
    amount: string;
  }

  export interface CreateActionRsp {
    follow_id: string;
    action: string;
    code: string;
    code_url: string;
  }
}
