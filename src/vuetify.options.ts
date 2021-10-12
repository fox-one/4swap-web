import UIKit from "@foxone/uikit";
import { mergeDeep } from "vuetify/lib/util/helpers";

export default function ({ store }) {
  const isDark = store.state.app.dark;

  const options = {
    theme: {
      dark: isDark,
      options: {
        customProperties: true,
      },
      themes: {
        light: {},
        dark: {},
      },
    },
  };

  return mergeDeep(UIKit.preset, options);
}
