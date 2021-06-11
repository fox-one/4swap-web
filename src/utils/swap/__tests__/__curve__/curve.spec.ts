import BigNumber from "bignumber.js";
import { expect } from "chai";
import "mocha";
import { Curve } from "../../curve";

describe("cuver swap result should be work", () => {
  it("cuvre should work correct", () => {
    const data = ["0.15", "0.15"];
    const curve = new Curve(200);
    const v1 = curve.swap(+data[0], +data[1], 0.01);
    const v2 = curve.swapReverse(+data[0], +data[1], 0.01);
    console.log(v1, v2);
  });
});

describe("curve swap result should be equal with backend", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const data = require("./curve.json");

  const curve = new Curve(200);
  const dx = 100;
  for (const x of data) {
    const d = curve.getD([+x[0], +x[1]]);
    const _dy = curve.swap(+x[0], +x[1], dx);
    const _dx = curve.swapReverse(+x[0], +x[1], +x[3]);

    it("d should equal backend result", () => {
      expect(
        d -
          new BigNumber(x[2]).decimalPlaces(8, BigNumber.ROUND_DOWN).toNumber()
      ).to.lte(5e-8);
    });

    it("_dy should equal backend result", () => {
      expect(
        Math.abs(
          _dy -
            new BigNumber(x[3])
              .decimalPlaces(8, BigNumber.ROUND_DOWN)
              .toNumber()
        )
      ).to.lte(5e-8);
    });

    it("_dx should equal backend result", () => {
      expect(
        Math.abs(
          _dx -
            new BigNumber(x[4])
              .decimalPlaces(8, BigNumber.ROUND_CEIL)
              .toNumber()
        )
      ).to.lte(5e-8);
    });
  }
});
