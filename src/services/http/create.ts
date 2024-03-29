/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-promise-reject-errors */
import { NuxtAppOptions } from "@nuxt/types";
import { AxiosRequestConfig } from "axios";
import Http from "./http";
import createApis from "./index";
import { v4 as uuid } from "uuid";
import { logout } from "@/utils/account";
import { MIXIN_HOST } from "@/constants";

function generateStructureInterceptor(app: NuxtAppOptions) {
  return [
    (res) => {
      const reqId = res?.headers?.["x-request-id"];
      const resId = res?.config?.headers?.["x-request-id"];

      if (reqId && resId && reqId !== resId) {
        return Promise.reject(
          new Error(
            `X-Request-Id Not Match: request: ${res.headers["x-request-id"]}; response: ${res.config.headers["x-request-id"]}`
          )
        );
      }

      if (res?.data?.code) {
        return Promise.reject(res.data);
      }

      if (res?.data?.error?.code === 401) {
        logout({ $store: app.store });

        return Promise.reject(res.data.error);
      }

      return res.data.data;
    },
    (error) => {
      if (error.response && error.response.data) {
        const status = error.response.status;

        if (!error.response.config.skipCheckAuth && status === 401) {
          logout({ $store: app.store });
        }

        const { code, msg } = error.response.data;
        return Promise.reject({ code, msg });
      } else {
        return Promise.reject({ code: -1, msg: error.toString() });
      }
    },
  ];
}

function generateAuthInterceptor(app: NuxtAppOptions) {
  return [
    (configs) => {
      let token = "";

      if (configs.baseURL === MIXIN_HOST) {
        token = app.store?.state.auth.mixin_token;
      } else {
        token = app.store?.state.auth.token;
      }

      if (token) {
        configs.headers.Authorization = `Bearer ${token}`;
      }

      configs.headers["x-request-id"] = uuid();

      return configs;
    },
  ];
}

export default function createHttpService(app: NuxtAppOptions, base) {
  const config: AxiosRequestConfig = { baseURL: base };
  const http = new Http(
    config,
    [generateAuthInterceptor(app)],
    [generateStructureInterceptor(app)]
  );
  return createApis(http);
}
