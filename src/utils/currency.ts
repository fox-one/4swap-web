import * as currency from "@foxone/utils/currency";
import BigNumber from "bignumber.js";
import { getLangCode } from "./helper";

export const CURRENCY = {
  CNY: { name: "CNY", symbol: "¥" },
  USD: { name: "USD", symbol: "$" },
  JPY: { name: "JPY", symbol: "¥" },
  EUR: { name: "EUR", symbol: "€" },
  KRW: { name: "KRW", symbol: "₩" },
  HKD: { name: "HKD", symbol: "HK$" },
  GBP: { name: "GBP", symbol: "£" },
  AUD: { name: "AUD", symbol: "A$" },
  SGD: { name: "SGD", symbol: "S$" },
  MYR: { name: "MYR", symbol: "RM" },
  PHP: { name: "PHP", symbol: "₱" },
  AED: { name: "AED", symbol: "AED" },
};

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
