import BigNumber from "bignumber.js";

BigNumber.config({
  EXPONENTIAL_AT: 12,
});

export function getPrecision(n) {
  return new BigNumber(n).dp();
}

export function getDefaultPercision(n) {
  const v = new BigNumber(n);
  return v.gt(1e4) ? 2 : v.gt(1) ? 4 : 8;
}

export function addSymbol(n) {
  return n >= 0 ? `+${n}` : n;
}

export function toFixed(n: string | number, p: number) {
  if (n === undefined || n === null) {
    return "";
  }
  return parseFloat("" + n).toFixed(p);
}

export function toFixedWithUnit(n: string | number, p: number) {
  if (n === undefined || n === null) {
    return "";
  }
  n = "" + n;
  const unit = n.slice(n.length - 1);
  return parseFloat(n.slice(0, n.length - 1)).toFixed(p) + unit;
}

export function greaterThanTrillon(n: string | number): boolean {
  return new BigNumber(n).isGreaterThanOrEqualTo("1000000000000");
}

export function format({
  n,
  p,
  mp,
  fix,
}: {
  n: string | number;
  p?: number;
  mp?: number;
  fix?: boolean;
}): string {
  const v = new BigNumber(n);
  let q = p || getDefaultPercision(n);
  if (mp) {
    q = Math.min(q, mp);
  }
  if (fix) {
    return v.toFormat(q);
  } else {
    return v.decimalPlaces(q, 1).toFormat();
  }
}

export function formatWithSign(params: {
  n: string | number;
  p?: number;
  mp?: number;
  fix?: boolean;
}) {
  let sign = "";
  if (params.n > 0) sign = "+";
  return sign + format(params);
}

export function simplize(n, p = 3, lang = "en_us", prefix = "") {
  const isAsia = lang?.includes("zh") || lang?.includes("ja");
  const unit = isAsia ? ["", "万", "亿", "兆"] : ["", "K", "M", "B", "T"];
  const benchmark = isAsia ? 10000 : 1000;
  let x = new BigNumber(n);
  if (isAsia && p <= 3) p = 4;
  let i = 0;
  while (x.isGreaterThanOrEqualTo(benchmark) && !!unit[i + 1]) {
    x = x.dividedBy(benchmark);
    const y = x.toPrecision(p);
    x = new BigNumber(y);
    i += 1;
  }
  return prefix + (x.toPrecision(p, BigNumber.ROUND_DOWN).toString() + unit[i]);
}

export function toPercent(v: string | number, symbol: boolean, percision = 2) {
  v = Number(v);
  if (isNaN(v)) {
    return "- -";
  }
  const s = symbol && v >= 0 ? "+" : "";
  if (percision >= 0) {
    return s + (Number(v) * 100).toFixed(percision) + "%";
  }
  const n = new BigNumber(v);
  return n.multipliedBy(100) + "%";
}

export function numWithSign(num: number | string) {
  return +num >= 0 ? `+${num}` : num;
}

// convert 2 assets. e.g. 0.0001 btc to jpy = ?
export function convert2Assets(
  assets,
  baseAssetId,
  baseAmount,
  targetAssetId,
  maxPercision = 4
) {
  const getAsset = (symbol) => {
    return assets.find((x) => x.asset_id === symbol);
  };
  const from = getAsset(baseAssetId);
  const to = getAsset(targetAssetId);

  const baseAmountN = new BigNumber(baseAmount)
    .times(from.price_usd)
    .div(to.price_usd);
  return format({ n: baseAmountN.toString(), mp: maxPercision });
}

export function formatCurrency(
  vm: Vue,
  fiatSymbol: string,
  amount: number | string,
  fraction = -1
) {
  let ret = "";
  let amountNum = 0;
  if (amount.constructor === String) {
    amountNum = parseFloat(amount);
  } else {
    amountNum = amount as number;
  }
  if (window.Intl) {
    const opts: any = {
      style: "currency",
      currency: fiatSymbol.toUpperCase(),
      // comment it because iOS do not support it
      // currencyDisplay: "narrowSymbol",
    };
    if (fraction !== -1) {
      opts["minimumFractionDigits"] = fraction;
    }
    // if the amount is too small but still greater than zero, try to calculate a better fraction.
    if (amountNum < 0.01 && 0 < amountNum) {
      const zeroCount = -Math.floor(Math.log(amountNum) / Math.log(10) + 1);
      opts["minimumFractionDigits"] = zeroCount + 2;
    }
    ret = new Intl.NumberFormat(vm.$i18n.locale, opts).format(amountNum);
  } else {
    ret = fiatSymbol + amountNum.toFixed(2);
  }
  return ret;
}

export function formatCurrencyFromUSD(
  vm: Vue,
  fiatSymbol: string,
  amountUsd: number | string,
  fraction = -1
) {
  const fiats = vm.$store.state.global.fiats;
  const fiat = fiats.find((x) => {
    return x?.code.toUpperCase() === fiatSymbol.toUpperCase();
  });
  const amount = new BigNumber(amountUsd).multipliedBy(fiat?.rate);
  return formatCurrency(vm, fiatSymbol, amount.toNumber(), fraction);
}

export function formatFiat(vm, amountUsd, fraction = -1) {
  return formatCurrencyFromUSD(
    vm,
    vm.$store.state.app.settings.currency,
    amountUsd,
    fraction
  );
}

export function simplizeFiat(vm, n, p = 3) {
  let prefix = "";
  const currency = vm.$store.state.app.settings.currency;
  switch (currency) {
    case "JPY":
    case "CNY":
      prefix = "¥";
      break;
    case "USD":
      prefix = "$";
      break;
    default:
      break;
  }
  const fiats = vm.$store.state.global.fiats;
  const fiat = fiats.find((x) => {
    return x?.code.toUpperCase() === currency.toUpperCase();
  });
  const amount = new BigNumber(n).multipliedBy(fiat?.rate);
  return simplize(amount, p, vm.$vuetify.lang.current, prefix);
}
