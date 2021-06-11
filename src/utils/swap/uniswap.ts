export class Uniswap {
  // swap A for B
  // x, y is liquidity of A, B
  // dx is supply amount of A
  // k is liquidity of pair
  swap(x: number, y: number, dx: number): number;
  swap(x: number, y: number, dx: number, k: number): number;
  swap(x: number, y: number, dx: number, k?: number | undefined) {
    const _k = k || x * y;
    const _x = x + dx;
    const _y = _k / _x;
    const dy = y - _y;
    return dy;
  }

  // swap A for B
  // x, y is liquidity of A, B
  // dx is supply amount of A
  // dy is wanted amount of B
  swapReverse(x: number, y: number, dy: number): number;
  swapReverse(x: number, y: number, dx: number, k: number): number;
  swapReverse(
    x: number,
    y: number,
    dy: number,
    k?: number | undefined
  ): number {
    const _k = k || x * y;
    const _y = y - dy;
    const _x = _k / _y;
    const dx = _x - x;
    return dx;
  }

  getPriceImpact(x: number, y: number, dx: number, dy: number) {
    return Math.max(1 - (y - dy) / (x + dx) / (y / x), 0);
  }
}
