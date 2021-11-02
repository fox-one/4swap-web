import { GLOBAL_EVENTS, CREATE_FEE } from "@/constants";
import { GlobalGetters, GlobalMutations } from "@/store/types";
import { Base64 } from "@foxone/utils";

export interface Callbacks {
  onSuccess?: (...args: any) => void;
  onError?: (...args: any) => void;
  checker?: (...args: any) => Promise<"success" | "reject" | "pending">;
  onStart?: (...args: any) => void;
  onEnd?: (...args: any) => void;
}

/**
 * common params that add or remove liquidity or swap action use
 *
 * @param {Vue} vm
 * @return {*}
 */
function getBaseParams(vm: Vue) {
  const userId = vm.$store.getters[GlobalGetters.USER_ID];

  if (!userId) {
    vm.$utils.helper.errorHandler(vm, { message: "User not found" });

    return null;
  }

  return { userId };
}

/**
 * execute payment to add liquidity
 *
 * @export
 * @param {Vue} vm
 * @param {API.DepositParams} params
 * @param {*} [cbs={}]
 * @return {*}
 */
export async function addLiquidity(
  vm: Vue,
  params: API.DepositParams,
  cbs: Callbacks = {}
) {
  const baseParams = getBaseParams(vm);

  if (!baseParams) return;

  const slippage = "0.001";
  const exp = 5 * 60;
  const memo = `1,${baseParams.userId},${params.follow_id},${params.opposite_asset_id},${slippage},${exp}`;
  const data = {
    action: memo,
    amount: params.amount,
    asset_id: params.asset_id,
    trace_id: params.trace_id,
    broker_id: vm.$config.BROKER_ID,
  };
  const {
    code,
    code_url: url,
    follow_id: traceId,
  } = await vm.$http.createActions(data);

  requestPayment(vm, { code, url, cbs, traceId });
}

/**
 * execute payment to remove liquidity
 *
 * @export
 * @param {Vue} vm
 * @param {API.RemoveParams} params
 * @param {*} [cbs={}]
 * @return {*}
 */
export async function removeLiquidity(
  vm: Vue,
  params: API.RemoveParams,
  cbs: Callbacks = {}
) {
  const baseParams = getBaseParams(vm);

  if (!baseParams) return;

  const memo = `2,${baseParams.userId},${params.follow_id}`;
  const data = {
    action: memo,
    amount: params.amount,
    asset_id: params.asset_id,
    broker_id: vm.$config.BROKER_ID,
  };
  const {
    code,
    code_url: url,
    follow_id: traceId,
  } = await vm.$http.createActions(data);

  requestPayment(vm, { code, url, cbs, traceId });
}

/**
 * excute payment to create pool
 *
 * @export
 * @param {Vue} vm
 * @param {API.CreatePoolParams} params
 * @param {Callbacks} [cbs={}]
 */
export async function createPool(
  vm: Vue,
  params: API.CreatePoolParams,
  cbs: Callbacks = {}
) {
  const memo = Base64.encode(
    JSON.stringify({
      t: "apply",
      p: [params.asset1_id, params.asset2_id],
    })
  );

  const data = {
    memo,
    assetId: CREATE_FEE.asset_id,
    amount: CREATE_FEE.amount,
    traceId: params.trace_id,
    recipient: vm.$config.MIXIN_CLIENT_ID,
  };

  requestPayment(vm, { params: data, cbs });
}

/**
 * execute payment to swap asset
 *
 * @export
 * @param {Vue} vm
 * @param {API.SwapParams} params
 * @param {*} [cbs={}]
 * @return {*}
 */
export async function swap(
  vm: Vue,
  params: API.SwapParams,
  cbs: Callbacks = {}
) {
  const baseParams = getBaseParams(vm);

  if (!baseParams) return;

  const memo = `3,${baseParams.userId},${params.follow_id},${params.fill_asset_id},${params.routes},${params.minimum}`;
  const data = {
    action: memo,
    amount: params.amount,
    asset_id: params.pay_asset_id,
    broker_id: vm.$config.BROKER_ID,
  };
  const {
    code,
    code_url: url,
    follow_id: traceId,
  } = await vm.$http.createActions(data);

  requestPayment(vm, { code, url, cbs, traceId });
}

/**
 * do payment action in diffrent platform
 * use fennec or mixin messenger or qrcode
 *
 * @export
 * @param {Vue} vm
 * @param {{
 *     code?: string;
 *     url?: string;
 *     traceId: string;
 *     params?: any;
 *     cbs: Callbacks;
 *   }} opts
 */
export async function requestPayment(
  vm: Vue,
  opts: {
    code?: string;
    url?: string;
    traceId?: string;
    params?: any;
    cbs: Callbacks;
  }
) {
  const url = opts.url || vm.$utils.mixin.genPaymentUrl(opts.params);

  if (vm.$fennec.connected) {
    if (opts.code) {
      await vm.$fennec.ctx?.wallet?.multisigsPayment({ code: opts.code });
      startCheckTransaction(vm, opts.cbs);
    } else {
      await vm.$fennec.ctx?.wallet?.transfer(opts.params);
      startCheckTransaction(vm, opts.cbs);
    }
  } else if (vm.$utils.mixin.isMixin()) {
    startCheckTransaction(vm, opts.cbs);
    window.location.href = `${url}`;
  } else {
    vm.$root.$emit(GLOBAL_EVENTS.OPEN_PAYMENT_MODAL, url, {
      onPaid: () => startCheckTransaction(vm, opts.cbs),
    });
  }
}

/**
 * start to check transaction result
 *
 * @export
 * @param {Vue} vm
 * @param {Callbacks} cbs
 */
export function startCheckTransaction(vm: Vue, cbs: Callbacks) {
  showPaying(vm);
  typeof cbs.onStart === "function" && cbs.onStart();

  pollingTransactionResult(vm, cbs);
}

/**
 * polling function to check whether transaction is success or not
 * continue polling when checker result is pending
 * execute callbacks when checker is success or error
 *
 * @export
 * @param {Vue} vm
 * @param {Callbacks} cbs
 */
export async function pollingTransactionResult(vm: Vue, cbs: Callbacks) {
  if (typeof cbs.checker === "function") {
    const result = await cbs.checker();

    if (!vm.$store.state.app.paying.visible) {
      return;
    }

    if (result !== "pending") {
      typeof cbs.onEnd === "function" && cbs.onEnd();
      hidePaying(vm);
    }

    if (result === "success") {
      typeof cbs.onSuccess === "function" && cbs.onSuccess();
    } else if (result === "reject") {
      typeof cbs.onError === "function" && cbs.onError();
    } else {
      const timer = setTimeout(() => {
        pollingTransactionResult(vm, cbs);
      }, 2000);

      setPayingTimer(vm, timer);
    }
  }
}

/**
 * check swap order is success or not
 *
 * @export
 * @param {Vue} vm
 * @param {string} traceId
 * @return {*}
 */
export async function checkSwapOrder(vm: Vue, traceId: string) {
  try {
    const order = await vm.$http.getOrder(traceId);

    if (order.state === "Done") {
      return "success";
    } else if (order.state === "Rejected") {
      return "reject";
    } else {
      return "pending";
    }
  } catch (error) {
    return "pending";
  }
}

/**
 * check deposit order is success or not
 *
 * @export
 * @param {Vue} vm
 * @param {string} traceId
 * @return {*}
 */
export async function checkDepositOrder(
  vm: Vue,
  traceId: string,
  isBase: boolean
) {
  try {
    const order = await vm.$http.getDepositOrder(traceId);
    const amount = isBase ? order.base_amount ?? 0 : order.quote_amount ?? 0;

    if (+amount > 0) {
      return "success";
    } else {
      return "pending";
    }
  } catch (error) {
    return "pending";
  }
}

export async function checkApplieOrder(vm: Vue, traceId: string) {
  try {
    const resp = await vm.$http.getApplieOrderInfo(traceId);

    return resp ? "success" : "pending";
  } catch (error) {
    return "pending";
  }
}

/**
 * check transaction success or not
 *
 * @export
 * @param {Vue} vm
 * @param {string} base
 * @param {string} quote
 * @param {string} follow
 * @return {*}
 */
export async function checkTransaction(
  vm: Vue,
  base: string,
  quote: string,
  follow: string
) {
  try {
    const resp = await vm.$http.getMyTransaction({ base, quote, follow });

    return resp ? "success" : "pending";
  } catch (error) {
    return "pending";
  }
}

export function showPaying(vm: Vue) {
  vm.$store.commit(GlobalMutations.SET_PAYING, { visible: true });
}

export function hidePaying(vm: Vue) {
  vm.$store.commit(GlobalMutations.SET_PAYING, { visible: false });
}

export function setPayingTimer(vm: Vue, timer) {
  vm.$store.commit(GlobalMutations.SET_PAYING, { timer });
}
