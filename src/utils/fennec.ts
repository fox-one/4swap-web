import { NuxtAppOptions } from "@nuxt/types";

export default class Fennec {
  #ctx;

  #ext;

  #app: NuxtAppOptions;

  #token;

  connected = false;

  constructor(app: NuxtAppOptions) {
    this.#app = app;
  }

  getExt() {
    return (window as any).__MIXIN__?.mixin_ext;
  }

  isInstalled() {
    return Boolean(this.getExt());
  }

  public async connect(origin: string) {
    if (!this.getExt()) {
      throw new Error("Browser Extension is not installed");
    }
    this.#ctx = await this.getExt().enable(origin);
    if (this.#ctx) {
      const token = await this.#ctx.wallet.signToken({
        payload: { from: origin },
      });
      this.#app.store?.commit("auth/SET_FENNEC_TOKEN", {
        token,
        scope: "PROFILE:READ ASSETS:READ",
      });
      this.#token = token;
      this.connected = true;
    }
  }

  checkCtx() {
    if (!this.getExt()) {
      throw new Error("Fennec context is not available");
    }
  }

  public getToken() {
    return this.#token;
  }

  public getAssets() {
    this.checkCtx();
    return this.#ctx.wallet.getAssets();
  }

  public getAsset(id: string) {
    this.checkCtx();
    return this.#ctx.wallet.getAsset(id);
  }

  public transfer(payload) {
    this.checkCtx();
    return this.#ctx.wallet.transfer(payload);
  }

  public multisigsPayment(payload) {
    this.checkCtx();
    return this.#ctx.wallet.multisigsPayment(payload);
  }
}
