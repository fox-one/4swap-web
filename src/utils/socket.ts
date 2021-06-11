import { Store } from "vuex";
import { v4 as uuid } from "uuid";
import { throttle, debounce } from "@/utils/helper";

interface WsMessage<T> {
  id: string;
  method: string;
  status: number;
  url: string;
  body: {
    data?: T;
    code?: number;
    msg?: string;
  };
}

function execute(cb, ...args) {
  if (cb && typeof cb === "function") {
    cb(...args);
  }
}

export default class Socket {
  store: Store<any>;
  websocket!: WebSocket;
  url: any;
  listeners = {};
  queue: any[] = [];

  constructor(url: string, store: Store<any>) {
    this.store = store;
    this.url = url;
    this._connect();
  }

  get(path): Promise<any> {
    return this._send({
      method: "GET",
      auth: this.store.state.auth.token,
      url: path,
    });
  }

  post(path, data): Promise<any> {
    return this._send({
      method: "POST",
      auth: this.store.state.auth.token,
      url: path,
      body: data,
    });
  }

  _connect = throttle(() => {
    if (
      this.websocket?.readyState === WebSocket.CONNECTING ||
      this.websocket?.readyState === WebSocket.OPEN
    )
      return;
    this.websocket = new WebSocket(this.url);
    this._setstate();
    this.websocket.onopen = this._onopen.bind(this);
    this.websocket.onmessage = this._onmessage.bind(this);
    this.websocket.onclose = this._onclose.bind(this);
    this.websocket.onerror = this._onclose.bind(this);
  }, 3000);

  _heartCheck = debounce(() => {
    this.get("/ping");
  }, 50000);

  _send(params) {
    return new Promise((resolve, reject) => {
      const id = uuid();
      const data = JSON.stringify({ ...params, id });
      this.listeners[id] = (res: WsMessage<any>) => {
        res.body.code ? reject(res.body) : resolve(res.body.data);
      };

      setTimeout(() => {
        if (this.listeners[id]) {
          reject({ msg: "请求超时" });
          delete this.listeners[id];
        }
      }, 15000);

      if (this.websocket.readyState === WebSocket.OPEN) {
        this.websocket.send(data);
      } else if (params.method === "POST") {
        reject({ msg: "网络未连接" });
        delete this.listeners[id];
      } else {
        this.queue.push(data);
      }
    });
  }

  _setstate() {
    this.store.commit("app/SET_WS_STATE", this.websocket?.readyState);
  }

  _onopen() {
    this._setstate();
    this._heartCheck();
    while (this.queue.length > 0) {
      this.websocket.send(this.queue.shift());
    }
  }

  _onmessage(evt) {
    this._heartCheck();
    const msg: WsMessage<any> = JSON.parse(evt.data);
    const callback = this.listeners[msg.id];
    if (callback) {
      if (msg.body.code === 401) {
        this.store.dispatch("auth/logout");
      }
      execute(callback, msg);
      delete this.listeners[msg.id];
    }
  }

  _onclose() {
    this._setstate();
    this._connect();
    setTimeout(() => {
      this._connect();
    }, 3500);
  }
}
