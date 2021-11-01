import UIKit from "@foxone/uikit";
import icons from "@/utils/icons";
import { mergeDeep } from "vuetify/lib/util/helpers";

const themesLake = {
  light: {
    primary: "#000000",
    secondary: "#0FC2FC",
    third: "#EDFBFC",
    forth: "#DEF3F4",
    warning_bg: "#FCF8F0",
    warning_emphsize: "#75080A",
    error_bg: "#FBF2F2",
    error_emphsize: "#75080A",
  },
  dark: {
    primary: "#FFFFFF",
    secondary: "#46CFFB",
    third: "#075973",
    warning_bg: "#5C3A13",
    warning_emphsize: "#FFE08F",
    error_bg: "#4A2222",
    error_emphsize: "#F34A4D",
  },
};

const themeFSwap = {
  light: {
    primary: "#000000",
    secondary: "#EDFBFC",
    third: "#FDF4F8",
    forth: "#1D7D9B",
    warning_bg: "#FCF8F0",
    warning_emphsize: "#75080A",
    error_bg: "#FBF2F2",
    error_emphsize: "#75080A",
  },
  dark: {
    primary: "#FFFFFF",
    secondary: "#EE4596",
    third: "#88305A",
    warning_bg: "#5C3A13",
    warning_emphsize: "#FFE08F",
    error_bg: "#4A2222",
    error_emphsize: "#F34A4D",
  },
};

export default function ({ store, $config }) {
  // const isDark = store.state.app.dark;
  const isDark = false;

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

  return mergeDeep(UIKit.preset, options);
}
