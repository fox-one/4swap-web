import Http from "~/utils/http";
import { AxiosRequestConfig } from "axios";
import {
  AppInfo,
  IDepositOrder,
  ISwapOrder,
  IMixinAsset,
  ICreateAction,
  ICreateActionRsp,
  IMixinMulPaymentCodeParams,
  IMixinMulPaymentCodeRsp,
} from "../types/vo";
import { IPreOrderParams } from "../types/dto";
import { convertPairOrder } from "@/utils/pair/help";
import { MIXIN_HOST, FIAT_TOKEN, PRSID } from "@/constants";
import { fmtProfits } from "@/utils/profits";

export default function (http: Http) {
  return {
    auth(code: string): Promise<any> {
      return http.post("/oauth", {
        data: { code },
      });
    },

    getAppInfo(): Promise<AppInfo> {
      return http.get("/info");
    },

    getAssets(): Promise<{ assets: API.Asset[] }> {
      return http.get("/assets");
    },

    getFiats(): Promise<{ assets: API.Fiat[] }> {
      return http.get(`${MIXIN_HOST}/fiats`, {
        token: FIAT_TOKEN,
      } as any);
    },

    async getPair({ input, output }): Promise<API.Pair> {
      const pair = await http.get(`/pairs/${input}/${output}`);
      return convertPairOrder(input, pair);
    },

    async getPairs(): Promise<API.PairsRes> {
      // @TODO prs event
      const resp = await http.get("/pairs");
      const pairs = resp.pairs.map((x) => {
        if (x?.base_asset_id === PRSID || x.quote_asset_id === PRSID) {
          x.hidden = true;
        }
        return x;
      });
      resp.pairs = pairs;
      return resp;
    },

    getDepositOrder(follow: string): Promise<API.DepositOrder> {
      return http.get(`/deposits/${follow}`);
    },

    getMarketData(params: {
      base: string;
      quote: string;
      dur: API.Duration;
    }): Promise<API.MarketData[]> {
      return http.get(`/stats/markets/${params.base}/${params.quote}`, {
        params: { dur: params.dur },
      });
    },

    getAllMarketData(params: { dur: API.Duration }): Promise<API.MarketData[]> {
      return http.get("/stats/markets", { params: { dur: params.dur } });
    },

    getKlineData(params: {
      base: string;
      quote: string;
      dur: API.Duration;
    }): Promise<API.KlineData[]> {
      return http.get(
        `/stats/markets/${params.base}/${params.quote}/kline/v2`,
        {
          params: { dur: params.dur },
        }
      );
    },

    async getProfits(
      pair: API.Pair,
      params: {
        base: string;
        quote: string;
      }
    ): Promise<API.PairProfits> {
      const data: API.ProfitsData = await http.get(
        `/stats/profits/${params.base}/${params.quote}`
      );
      return fmtProfits(pair, data);
    },

    async getProfitsHistory(
      pair: API.Pair,
      params: {
        base: string;
        quote: string;
        dur: API.Duration;
      }
    ): Promise<API.PairProfits[]> {
      const data: API.ProfitsData[] = await http.get(
        `/stats/profits/${params.base}/${params.quote}/history`,
        {
          params: { dur: params.dur },
        }
      );
      return data.map((x) => fmtProfits(pair, x));
    },

    requestDeposit(params: {
      base: string;
      quote: string;
      data;
    }): Promise<IDepositOrder> {
      return http.post(`/pairs/${params.base}/${params.quote}/deposit`, {
        data: params.data,
      });
    },

    getTransaction(id): Promise<API.Transaction> {
      return http.get(`/transactions/${id}`);
    },

    getGloabalTransactions({ limit, cursor }): Promise<any> {
      return http.get(`/transactions`, { params: { limit, cursor } });
    },

    getTransactions({
      base = "",
      quote = "",
      limit = 10,
      cursor = "",
      type = "",
    }) {
      return http.get(
        `/transactions/${base}/${quote}?limit=${limit}&cursor=${cursor}&type=${type}`
      );
    },

    getMyTransactions({ base, quote, type, limit = 10, cursor = "" }) {
      return http.get(`/transactions/${base}/${quote}/mine`, {
        params: { type, limit, cursor },
      });
    },

    getMyTransaction({ base, quote, follow }): Promise<any> {
      return http.get(`/transactions/${base}/${quote}/mine/${follow}`);
    },

    getPreOrder(params: IPreOrderParams): Promise<ISwapOrder> {
      return http.post("/orders/pre", {
        data: params,
      });
    },

    getOrder(id: string): Promise<API.SwapOrder> {
      return http.get(`/orders/${id}`);
    },

    async getAssetsFromMixin(): Promise<IMixinAsset[]> {
      return await http.get(`${MIXIN_HOST}/assets`);
    },

    async getAssetFromMixin(id: string): Promise<IMixinAsset> {
      return await http.get(`${MIXIN_HOST}/assets/${id}`);
    },

    async genMulPaymentCode(
      data: IMixinMulPaymentCodeParams
    ): Promise<IMixinMulPaymentCodeRsp> {
      return await http.post(`${MIXIN_HOST}/payments`, { data });
    },

    async createActions(params: ICreateAction): Promise<ICreateActionRsp> {
      return http.post(`/actions`, {
        data: params,
      });
    },

    async getMe() {
      return await http.get(`${MIXIN_HOST}/me`);
    },

    getHeartCheck() {
      return http.get("/hc");
    },

    config(options: AxiosRequestConfig) {
      http.config(options);
    },

    async getApplieInfo() {
      return await http.get("/applies/info");
    },

    async getApplieOrderInfo(trace_id: string) {
      return await http.get(`/applies/${trace_id}`);
    },
  };
}
