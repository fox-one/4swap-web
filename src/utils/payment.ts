import { GLOBAL_EVENTS } from "~/constants";

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

export async function deposit(vm: Vue, params: DepositParams, cbs = {}) {
  const baseParams = getBaseParams(vm);
  if (!baseParams) return;

  const slippage = "0.001";
  const exp = 5 * 60;
  const memo = `1,${baseParams.userId},${params.follow_id},${params.opposite_asset_id},${slippage},${exp}`;

  return requestPayment(
    vm,
    {
      action: memo,
      amount: params.amount,
      asset_id: params.asset_id,
      trace_id: params.trace_id,
    },
    cbs
  );
}

export async function remove(vm: Vue, params: RemoveParams, cbs = {}) {
  const baseParams = getBaseParams(vm);
  if (!baseParams) return;

  const memo = `2,${baseParams.userId},${params.follow_id}`;
  return requestPayment(
    vm,
    {
      action: memo,
      amount: params.amount,
      asset_id: params.asset_id,
    },
    cbs
  );
}

export async function swap(vm: Vue, params: SwapParams, cbs = {}) {
  const baseParams = getBaseParams(vm);
  if (!baseParams) return;

  const memo = `3,${baseParams.userId},${params.follow_id},${params.fill_asset_id},${params.routes},${params.minimum}`;

  return requestPayment(
    vm,
    {
      action: memo,
      amount: params.amount,
      asset_id: params.pay_asset_id,
    },
    cbs
  );
}

function getBaseParams(vm: Vue) {
  const userId = vm.$store.getters["global/getUserId"];
  if (!userId) {
    vm.$utils.helper.errorHandler(vm, {
      message: "USER_ID NOT FOUND",
      code: "",
    });
    return null;
  }

  return {
    userId,
  };
}

export async function requestPayment(
  vm: Vue,
  params: API.CreateAction,
  cbs = {}
) {
  const resp = await vm.$http.createActions({
    ...params,
    broker_id: vm.$config.BROKER_ID,
  });

  // connected to Fennec?
  if (vm.$fennec.connected) {
    return await vm.$fennec.multisigsPayment({ code: resp.code });
  }

  // not connected to Fennec
  if (vm.$utils.helper.isDesktop()) {
    vm.$root.$emit(GLOBAL_EVENTS.OPEN_PAYMENT_MODAL, resp.code_url, cbs);
  } else {
    window.location.href = `${resp.code_url}`;
  }
}

export async function openTransferPayment(vm: Vue, params, cbs) {
  if (vm.$fennec.connected) {
    return await vm.$fennec.transfer(params);
  }

  const payment = vm.$utils.helper.genPaymentUrl;
  const url = payment(params);

  if (vm.$utils.helper.isDesktop()) {
    vm.$root.$emit(GLOBAL_EVENTS.OPEN_PAYMENT_MODAL, url, cbs);
  } else {
    window.location.href = url;
  }
}
