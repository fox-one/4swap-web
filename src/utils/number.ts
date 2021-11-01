import * as number from "@foxone/utils/number";
import { getLangCode } from "./helper";

export function simplize(vm: Vue, opts: { n: number }) {
  const locale = getLangCode(vm.$store.$i18n.locale);

  return number.simplize({ ...opts, locale });
}

export function attchSign({ n, text }: { n: number; text: string }) {
  const sign = +n >= 0 ? "+" : "-";

  return `${sign} ${text}`;
}
