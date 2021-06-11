import { CHART_SCHEMES } from "~/constants";

export const colorUp = (vm: Vue) => {
  const scheme = vm.$store.state.app.settings.chartScheme;
  return CHART_SCHEMES[scheme].up;
};

export const colorDown = (vm: Vue) => {
  const scheme = vm.$store.state.app.settings.chartScheme;
  return CHART_SCHEMES[scheme].down;
};

export const colorPrimary = (isDark: boolean) =>
  isDark ? "#f16aab" : "#ee4596";

export const colorGery3 = (isDark: boolean) => (isDark ? "#9b9c9d" : "#666666");
