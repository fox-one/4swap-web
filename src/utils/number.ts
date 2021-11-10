import * as number from "@foxone/utils/number";
import { shouldPolyfill } from "@formatjs/intl-numberformat/should-polyfill";

async function polyfill(locale: string) {
  if (!shouldPolyfill(locale)) {
    return;
  }
  // Load the polyfill 1st BEFORE loading data
  await import("@formatjs/intl-numberformat/polyfill");
  switch (locale) {
    default:
      await import("@formatjs/intl-numberformat/locale-data/en");
      break;
    case "fr":
      await import("@formatjs/intl-numberformat/locale-data/fr");
      break;
  }
}

polyfill("en");
polyfill("fr");
polyfill("ja");
polyfill("de");
polyfill("es");
polyfill("zh");
polyfill("ko");

export function simplize(vm: Vue, opts: { n: number }) {
  const locale = vm.$store.$i18n.locale;

  return number.simplize({ ...opts, locale });
}

export function attachSign({
  n,
  text,
  space = true,
}: {
  n: number;
  text: string;
  space?: boolean;
}) {
  const sign = +n >= 0 ? "+" : "-";

  return `${sign}${space ? " " : ""}${text}`;
}
