import UIKit from "@foxone/uikit";
import icons from "@/utils/icons";
import { mergeDeep } from "vuetify/lib/util/helpers";

const themesLake = {
  light: {
    primary: "#000000",
    secondary: "#0FC2FC",
    third: "#EDFBFC",
    risk_emphasize: "#75080a",
  },
  dark: {
    primary: "#FFFFFF",
    secondary: "#46CFFB",
    third: "#075973",
    risk_emphasize: "#f34a4d",
  },
};

const themeFSwap = {
  light: {
    primary: "#000000",
    secondary: "#EDFBFC",
    third: "#FDF4F8",
    risk_emphasize: "#75080a",
  },
  dark: {
    primary: "#FFFFFF",
    secondary: "#EE4596",
    third: "#88305A",
    risk_emphasize: "#f34a4d",
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
