import * as currency from "@foxone/utils/currency";
import BigNumber from "bignumber.js";
import { getLangCode } from "./helper";

export function toFiat(
  vm: Vue,
  opts: { n: BigNumber.Value; short?: boolean },
  part = false
) {
  const to = vm.$store.state.app.settings.currency;
  const rates = vm.$store.state.pool.fiats;
  const locale = getLangCode(vm.$store.$i18n.locale);
  const configs = opts.short
    ? {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        notation: "compact",
      }
    : {};

  return currency.toFiat({ n: opts.n, configs, to, rates, locale }, part);
}
