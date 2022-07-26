import { CREATE_FEE } from "@/constants";
import { GlobalGetters } from "@/store/types";
import { Base64 } from "@foxone/utils";

export interface Callbacks {
  onSuccess?: (...args: any) => void;
  onError?: (...args: any) => void;
}

function getBaseParams(vm: Vue) {
  const userId = vm.$store.getters[GlobalGetters.USER_ID];

  if (!userId) {
    throw new Error("User not found");
  }

  return { userId };
}

export async function addLiquidity(
  vm: Vue,
  params: API.DepositParams,
  isBase: boolean,
  info
) {
  const baseParams = getBaseParams(vm);
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
  const { code, follow_id } = await vm.$http.createActions(data);

  await vm.$passport.payment({
    code,
    info,
    multisig: true,
    hideCheckingModal: false,
    checker: () => {
      return checkDepositOrder(vm, follow_id, isBase);
    },
  } as any);
}

export async function removeLiquidity(
  vm: Vue,
  params: API.RemoveParams,
  options: { baseId: string; quoteId: string },
  info
) {
  const baseParams = getBaseParams(vm);
  const memo = `2,${baseParams.userId},${params.follow_id}`;
  const data = {
    action: memo,
    amount: params.amount,
    asset_id: params.asset_id,
    broker_id: vm.$config.BROKER_ID,
  };
  const { code, follow_id } = await vm.$http.createActions(data);

  await vm.$passport.payment({
    code,
    info,
    multisig: true,
    checker: () => {
      return checkTransaction(vm, options.baseId, options.quoteId, follow_id);
    },
  });
}

export async function swap(
  vm: Vue,
  params: API.SwapParams,
  info,
  cbs: Callbacks
) {
  const baseParams = getBaseParams(vm);
  const memo = `3,${baseParams.userId},${params.follow_id},${params.fill_asset_id},${params.routes},${params.minimum}`;
  const data = {
    action: memo,
    amount: params.amount,
    asset_id: params.pay_asset_id,
    broker_id: vm.$config.BROKER_ID,
  };
  const { code, follow_id } = await vm.$http.createActions(data);

  await vm.$passport.payment({
    code,
    info,
    multisig: true,
    checker: () => {
      return checkSwapOrder(vm, follow_id, cbs);
    },
  });
}

export async function createPool(vm: Vue, params: API.CreatePoolParams) {
  const memo = Base64.encode(
    JSON.stringify({
      t: "apply",
      p: [params.asset1_id, params.asset2_id],
    })
  );

  await vm.$passport.payment({
    assetId: CREATE_FEE.asset_id,
    amount: CREATE_FEE.amount,
    recipient: vm.$config.MIXIN_CLIENT_ID,
    traceId: params.trace_id,
    memo,
    info: {
      amount: CREATE_FEE.amount,
      logo: CREATE_FEE.logo,
      symbol: CREATE_FEE.symbol,
    },
    checker: () => {
      return checkApplieOrder(vm, params.trace_id);
    },
  });
}

export async function checkSwapOrder(vm: Vue, traceId: string, cbs: Callbacks) {
  try {
    const order = await vm.$http.getOrder(traceId);

    if (order.state === "Done") {
      cbs.onSuccess?.();
      return true;
    } else if (order.state === "Rejected") {
      cbs.onError?.();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export async function checkDepositOrder(
  vm: Vue,
  followId: string,
  isBase: boolean
) {
  try {
    const order = await vm.$http.getDepositOrder(followId);
    const amount = isBase ? order.base_amount ?? 0 : order.quote_amount ?? 0;

    return +amount > 0;
  } catch (error) {
    return false;
  }
}

export async function checkApplieOrder(vm: Vue, traceId: string) {
  try {
    const resp = await vm.$http.getApplieOrderInfo(traceId);

    return Boolean(resp);
  } catch (error) {
    return false;
  }
}

export async function checkTransaction(
  vm: Vue,
  base: string,
  quote: string,
  follow: string
) {
  try {
    const resp = await vm.$http.getMyTransaction({ base, quote, follow });

    return Boolean(resp);
  } catch (error) {
    return false;
  }
}
