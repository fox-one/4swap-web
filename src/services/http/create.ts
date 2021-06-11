/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-promise-reject-errors */
import { NuxtAppOptions } from "@nuxt/types";
import { AxiosRequestConfig } from "axios";
import Http from "~/utils/http";
import createApis from "./index";
import { v4 as uuid } from "uuid";

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
        if (res.data.error.code === 401) {
          app.store?.dispatch("auth/logout");
        }
        return Promise.reject(res.data.error);
      }
      return res.data.data;
    },
    (error) => {
      if (error.response && error.response.data) {
        const status = error.response.status;
        if (status === 401) {
          app.store?.dispatch("auth/logout");
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
      if (configs.token) {
        token = configs.token;
      } else {
        if (app.$fennec.connected) {
          token = app.$fennec.getToken();
        } else {
          token = app.$utils.helper.getToken(app.store);
        }
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
