import Vue from "vue";

import UIKit from "@foxone/uikit";
import Passport from "@foxone/mixin-passport";
import PandoUI from "@foxone/pando-ui";
import InfiniteScroll from "vue-infinite-scroll";
import dayjs from "dayjs";
import { AuthMethod } from "@/enum";
import { GlobalMutations } from "@/store/types";

import "@/components";
import "@foxone/uikit/build/index.min.css";
import "@foxone/pando-ui/build/index.css";

import type { Plugin } from "@nuxt/types";

const plugin: Plugin = ({ app, store }) => {
  Vue.use(UIKit, {
    vuetify: app.vuetify,
    dialog: { flat: true },
    toast: { top: false, centered: true },
    auth: {
      wallets: ["fennec", "mixin", "metamask", "walletconnect"],
      clientId: app.$config.MIXIN_CLIENT_ID,
      scope: "PROFILE:READ ASSETS:READ",
      pkce: true,
    },
  });

  Vue.use(Passport, {
    origin: app.$config.CHANNEL_NAME,
    config: { infuraId: "a018fa2f735a435f9a7917f0d429c61a" },
    chainId: "0x120c7",
    customizeToken: true,
    signMessage: true,
    hooks: {
      beforeSignMessage: async () => {
        return {
          chainId: 73927,
          statement: `You'll login to ${app.$config.CHANNEL_NAME} by the signature`,
          issuedAt: dayjs().format(),
          expirationTime: dayjs(
            new Date(new Date().getTime() + 1000 * 60 * 3)
          ).format(),
        };
      },
      onDisconnect: () => {
        app.$utils.account.logout({ $store: app.store });
      },
      onDistributeToken: async (params) => {
        let data: API.AuthParams;

        if (params.type === "mixin_token") {
          data = { method: AuthMethod.MixinToken, mixin_token: params.token };
          store.commit(GlobalMutations.SET_MIXIN_TOKEN, params.token);
        } else {
          data = {
            method: AuthMethod.MVM,
            mvm_signed_message: params.message,
            mvm_signature: params.signature,
          };
        }

        const { pando_token, user } = await app.$http.auth(data);

        store.commit(GlobalMutations.SET_PROFILE, user);

        return { token: pando_token };
      },
    },
  });

  Vue.use(PandoUI, app.vuetify);
  Vue.use(InfiniteScroll);
};

export default plugin;
