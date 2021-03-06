import * as number from "@foxone/utils/number";
import BigNumber from "bignumber.js";

BigNumber.config({ EXPONENTIAL_AT: 12 });

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
