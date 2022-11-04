import { preset } from "@foxone/uikit";
import icons from "@/utils/icons";
import { mergeDeep } from "vuetify/lib/util/helpers";

const themesLake = {
  light: {
    primary: "#000000",
    secondary: "#3154D0",
    third: "#F1F9FF",
    forth: "#DEF3F4",
    fifth: "#F6F8FC",
    warning_bg: "#FCF8F0",
    warning_emphsize: "#75080A",
    error_bg: "#FBF2F2",
    error_emphsize: "#75080A",
  },
  dark: {
    primary: "#FFFFFF",
    secondary: "#46CFFB",
    third: "#303030",
    forth: "#0D7292",
    fifth: "#F6F8FC",
    warning_bg: "#5C3A13",
    warning_emphsize: "#FFE08F",
    error_bg: "#4A2222",
    error_emphsize: "#F34A4D",
  },
};

const themeFSwap = {
  light: {
    primary: "#000000",
    secondary: "#EE4596",
    third: "#FFF8FC",
    forth: "#f9e5ee",
    fifth: "#fff6fa",
    warning_bg: "#FCF8F0",
    warning_emphsize: "#75080A",
    error_bg: "#FBF2F2",
    error_emphsize: "#75080A",
  },
  dark: {
    primary: "#FFFFFF",
    secondary: "#EE4596",
    third: "#303030",
    forth: "#6f2848",
    fifth: "#763f59",
    warning_bg: "#5C3A13",
    warning_emphsize: "#FFE08F",
    error_bg: "#4A2222",
    error_emphsize: "#F34A4D",
  },
};

export default function ({ store, $config }) {
  const isDark = store.state.app.dark;

  const options = {
    icons: {
      values: icons,
    },
    theme: {
      dark: isDark,
      options: {
        customProperties: true,
      },
      themes: $config.CHANNEL === "lake" ? themesLake : themeFSwap,
    },
  };

  return mergeDeep(preset, options);
}
