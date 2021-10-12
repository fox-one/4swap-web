import { GLOBAL_EVENTS } from "~/constants";
import { GlobalGetters, GlobalMutations } from "~/store/types";

export interface Callbacks {
  success?: (...args: any) => void;
  error?: (...args: any) => void;
  checker?: (...args: any) => Promise<"success" | "error" | "pending">;
  start?: (...args: any) => void;
  end?: (...args: any) => void;
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
  cbs = {}
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
  cbs = {}
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
 * execute payment to swap asset
 *
 * @export
 * @param {Vue} vm
 * @param {API.SwapParams} params
 * @param {*} [cbs={}]
 * @return {*}
 */
export async function swap(vm: Vue, params: API.SwapParams, cbs = {}) {
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
    traceId: string;
    params?: any;
    cbs: Callbacks;
  }
) {
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
    window.location.href = `${opts.url}`;
  } else {
    vm.$root.$emit(GLOBAL_EVENTS.OPEN_PAYMENT_MODAL, opts.url, opts.cbs);
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
  typeof cbs.start === "function" && cbs.start();

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

    if (result !== "pending") {
      typeof cbs.end === "function" && cbs.end();
      hidePaying(vm);
    }

    if (result === "success") {
      typeof cbs.success === "function" && cbs.success();
    } else if (result === "error") {
      typeof cbs.error === "function" && cbs.error();
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
export async function checkDepositOrder(vm: Vue, traceId: string) {
  try {
    const order = await vm.$http.getDepositOrder(traceId);

    if (order.state === "Done") {
      return "success";
    } else if (order.state === "Cancelled") {
      return "reject";
    } else {
      return "pending";
    }
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
    const res = await vm.$http.getMyTransaction({ base, quote, follow });

    return res ? "success" : "pending";
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
