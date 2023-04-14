import Http from "./http";
import { AxiosRequestConfig } from "axios";
import { MIXIN_HOST } from "@/constants";

export default function (http: Http) {
  return {
    auth(data: API.AuthParams): Promise<API.AuthResult> {
      return http.post("/oauth", { data });
    },

    getAppInfo(): Promise<API.AppInfo> {
      return http.get("/info");
    },

    getAssets(): Promise<{ assets: API.Asset[] }> {
      return http.get("/assets");
    },

    getFiats(): Promise<{ assets: API.Fiat[] }> {
      return http.get(`${MIXIN_HOST}/external/fiats`);
    },

    getPair(data: API.GetPairParams): Promise<API.Pair> {
      return http.get(`/pairs/${data.base}/${data.quote}`);
    },

    getPairs(params: API.GetPairsParams): Promise<API.PairsRes> {
      return http.get("/pairs", { params });
    },

    getDepositOrder(follow: string): Promise<API.DepositOrder> {
      return http.get(`/deposits/${follow}`);
    },

    getMarketData(params: API.GetMarketDataParams): Promise<API.MarketData[]> {
      let url = "/stats/markets/";

      if (params.base && params.quote) {
        url = `/stats/markets/${params.base}/${params.quote}`;
      }

      return http.get(url, { params: { dur: params.dur } });
    },

    getAllMarketData(params: { dur: API.Duration }): Promise<API.MarketData[]> {
      return http.get("/stats/markets", { params: { dur: params.dur } });
    },

    getKlineData(params: API.GetKlineDataParams): Promise<API.KlineData[]> {
      let url = `/stats/markets/kline/v2`;

      if (params.base && params.quote) {
        url = `/stats/markets/${params.base}/${params.quote}/kline/v2`;
      }

      return http.get(url, { params: { dur: params.dur } });
    },

    async getProfits(params: API.GetProfitsParams): Promise<API.ProfitsData> {
      return http.get(`/stats/profits/${params.base}/${params.quote}`, {
        skipCheckAuth: true,
      } as any);
    },

    async getProfitsHistory(
      params: API.GetProfitsHistoryParams
    ): Promise<API.ProfitsData[]> {
      const url = `/stats/profits/${params.base}/${params.quote}/history`;

      return await http.get(url, { params: { dur: params.dur } });
    },

    requestDeposit(
      params: API.RequestDepositParams
    ): Promise<API.DepositOrder> {
      const url = `/pairs/${params.base}/${params.quote}/deposit`;

      return http.post(url, { data: params.data });
    },

    getTransaction(id: string): Promise<API.Transaction> {
      return http.get(`/transactions/${id}`);
    },

    getGloabalTransactions(params: API.PaginationParams): Promise<any> {
      return http.get(`/transactions`, { params });
    },

    getTransactions(
      params: API.GetTransactionsParams,
      cancelToken: any = undefined
    ) {
      const url = `/transactions/${params.base}/${params.quote}`;

      return http.get(url, { params, cancelToken });
    },

    getMyTransactions(
      params: API.GetTransactionsParams,
      cancelToken: any = undefined
    ) {
      const url = `/transactions/${params.base}/${params.quote}/mine`;

      return http.get(url, { params, cancelToken });
    },

    getMyTransaction(params: API.GetTransactionParams): Promise<any> {
      const url = `/transactions/${params.base}/${params.quote}/mine/${params.follow}`;

      return http.get(url);
    },

    getPreOrder(params: API.PreOrderParams): Promise<API.SwapOrder> {
      return http.post("/orders/pre", { data: params });
    },

    getOrder(id: string): Promise<API.SwapOrder> {
      return http.get(`/orders/${id}`);
    },

    async getMultiSigAssets(): Promise<API.MixinAsset[]> {
      return http.get(`${MIXIN_HOST}/network/assets/multisig`);
    },

    async getAssetsFromMixin(): Promise<API.MixinAsset[]> {
      return await http.get(`${MIXIN_HOST}/assets`);
    },

    async getAssetFromMixin(id: string): Promise<API.MixinAsset> {
      return await http.get(`${MIXIN_HOST}/assets/${id}`);
    },

    async getTiker(params) {
      return http.get(`${MIXIN_HOST}/ticker`, { params });
    },

    async createActions(data: API.CreateAction): Promise<API.CreateActionRsp> {
      return http.post(`/actions/v2`, { data });
    },

    async getMe() {
      return await http.get(`${MIXIN_HOST}/me`);
    },

    async getApplieInfo() {
      return await http.get("/applies/info");
    },

    async getApplieOrderInfo(trace_id: string) {
      return await http.get(`/applies/${trace_id}`);
    },

    getHeartCheck() {
      return http.get("/hc");
    },

    config(options: AxiosRequestConfig) {
      http.config(options);
    },
  };
}
