import Socket from "~/utils/socket";
import { IPair, IAsset, ISwapOrder, IPairsRes } from "../types/vo";
import { IPreOrderParams } from "../types/dto";
import { convertPairOrder } from "@/utils/pair/help";

export default function (socket: Socket) {
  return {
    _connect() {
      socket._connect();
    },

    getAssets(): Promise<{ assets: IAsset[] }> {
      return socket.get("/assets");
    },

    async getPair({ input, output }): Promise<IPair> {
      const pair = await socket.get(`/pairs/${input}/${output}`);
      return convertPairOrder(input, pair);
    },

    getPairs(): Promise<IPairsRes> {
      return socket.get("/pairs");
    },

    getDepositOrder(id): Promise<API.DepositOrder> {
      return socket.get(`/deposits/${id}`);
    },

    getTransaction(id) {
      return socket.get(`/transactions/${id}`);
    },

    getTransactions({ base, quote, limit = 10, cursor = "" }) {
      return socket.get(
        `/transactions/${base}/${quote}?limit=${limit}&cursor=${cursor}`
      );
    },

    getPreOrder(params: IPreOrderParams): Promise<ISwapOrder> {
      return socket.post("/orders/pre", params);
    },

    getOrder(id: string): Promise<ISwapOrder> {
      return socket.get(`/orders/${id}`);
    },

    getHeartCheck() {
      return socket.get("/hc");
    },
  };
}
