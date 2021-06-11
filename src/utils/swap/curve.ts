import BigNumber from "bignumber.js";

const nCoins = 2;
const one = 1;
const two = 2;

export class Curve {
  a: number;

  constructor(a: number) {
    this.a = a;
  }

  getD(xp: [number, number]) {
    const sum = xp.reduce((s, x) => s + x, 0);
    if (sum <= 0) {
      return 0;
    }

    let dp = 0;
    let d = sum;
    const ann = this.a * nCoins;

    for (let i = 0; i < 255; i++) {
      let _dp = d;
      for (const _x of xp) {
        _dp = (_dp * d) / (_x * nCoins);
      }

      dp = d;
      const d1 = (ann - one) * d;
      const d2 = (nCoins + one) * _dp;
      d = ((ann * sum + _dp * nCoins) * d) / (d1 + d2);

      const diff = new BigNumber(d - dp);
      if (diff.decimalPlaces(0, BigNumber.ROUND_DOWN).isZero()) {
        break;
      }
    }
    return new BigNumber(d).decimalPlaces(0, BigNumber.ROUND_DOWN).toNumber();
  }

  getY(d: number, x: number): number {
    const ann = this.a * nCoins;
    let c = (d * d) / (x * nCoins);
    c = (c * d) / (ann * nCoins);

    const b = x + d / ann;

    let yp = 0;
    let y = d;

    for (let i = 0; i < 255; i++) {
      yp = y;
      y = (y * y + c) / (y + y + b - d);

      const diff = new BigNumber(y - yp);
      if (diff.decimalPlaces(0, BigNumber.ROUND_DOWN).isZero()) {
        break;
      }
    }

    return y;
  }

  getX(d: number, y: number): number {
    const ann = this.a * nCoins;
    const k = (d * d * d) / ann / nCoins / nCoins;
    const j = d / ann - d + y + y;
    const n = (y - j) / two;
    const x = Math.sqrt(k / y + n * n) + n;
    return x;
  }

  // swap A for B
  // x, y is liquidity of A, B
  // dx is supply amount of A
  swap(x: number, y: number, dx: number): number;
  swap(x: number, y: number, dx: number, d: number): number;
  swap(x: number, y: number, dx: number, d?: number): number {
    x = x * 10e8;
    y = y * 10e8;
    dx = dx * 10e8;
    const _d = d || this.getD([x, y]);
    const _x = x + dx;
    const _y = this.getY(_d, _x);
    const dy = (y - _y) / 10e8;
    return dy;
  }

  // swap A for B
  // x, y is liquidity of A, B
  // dy is wanted amount of B
  swapReverse(x: number, y: number, dy: number): number;
  swapReverse(x: number, y: number, dy: number, d: number): number;
  swapReverse(x: number, y: number, dy: number, d?: number): number {
    x = x * 10e8;
    y = y * 10e8;
    dy = dy * 10e8;
    const _d = d || this.getD([x, y]);
    const _y = y - dy;
    const _x = this.getX(_d, _y);
    const dx = (_x - x) / 10e8;
    return dx;
  }

  getPriceImpact(dx: number, dy: number) {
    return Math.max(1 - dy / dx, 0);
  }
}
