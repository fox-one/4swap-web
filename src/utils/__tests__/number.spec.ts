import "mocha";
import { expect } from "chai";
import { simplize } from "../number";

describe("test number utils", () => {
  it("simplize number", () => {
    expect(simplize(100000.1, 3, "us")).equal("100K");
    expect(simplize(100000, 3, "us")).equal("100K");
    expect(simplize(999999, 3, "us")).equal("1.00M");
    expect(simplize(1000000, 3, "us")).equal("1.00M");
    expect(simplize(1000001, 3, "us")).equal("1.00M");
    expect(simplize(1588098921, 3, "us")).equal("1.59B");

    expect(simplize(100000.1, 4, "zh")).equal("10.00万");
    expect(simplize(100000, 4, "zh")).equal("10.00万");
    expect(simplize(999999, 4, "zh")).equal("100.0万");
    expect(simplize(1000000, 4, "zh")).equal("100.0万");
    expect(simplize(1000001, 4, "zh")).equal("100.0万");
    expect(simplize(1588598921, 4, "zh")).equal("15.89亿");
  });
});
