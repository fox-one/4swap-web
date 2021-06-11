import { isDarkTheme } from "@/utils/helper";

export const state = () => ({
  appbar: {
    title: "",
    style: "",
    show: true,
    back: false,
    flat: true,
  },
  dark: isDarkTheme(),
  settings: {
    slippage: 0.99,
    currency: "USD",
    chartScheme: "SCHEME_A",
    priceAlertCountDown: true,
  },
  bottomNav: {
    value: "",
    animation: false,
  },
  toast: {
    show: false,
    color: "info",
    message: "",
  },
  paying: {
    visible: false,
    timer: null,
  },
  websocket: {
    state: WebSocket.CLOSED,
  },
  initing: false,
  inited: false,
  notShowDevAlertAgain: false,
});

export const mutations = {
  SET_TOAST(state, { message = "", color = "info", show = true }) {
    state.toast.show = show;
    state.toast.message = message;
    state.toast.color = color;
  },
  SET_INITED(state, value) {
    state.inited = value;
  },
  SET_INITING(state, value) {
    state.initing = value;
  },
  SET_PAYING(state, data) {
    state.paying = { ...state.paying, ...data };
    if (data.visible === false) {
      clearTimeout(state.paying.timer as any);
    }
  },
  SET_APPBAR(state, value) {
    const defaultValue = {
      title: "",
      style: "",
      show: true,
      back: true,
      flat: true,
    };
    state.appbar = { ...defaultValue, ...value };
  },
  SET_WS_STATE(state, value) {
    state.websocket.state = value;
  },
  SET_BOTTOM_NAV(state, value) {
    state.bottomNav.value = value;
  },
  SET_SETTINGS(state, data) {
    state.settings = { ...state.settings, ...data };
  },
};

export default {
  state,
  mutations,
};
