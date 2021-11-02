import * as number from "@foxone/utils/number";
import { getLangCode } from "./helper";

export function simplize(vm: Vue, opts: { n: number }) {
  const locale = getLangCode(vm.$store.$i18n.locale);

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
