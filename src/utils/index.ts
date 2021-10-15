import utils, { mixin } from "@foxone/utils";
import * as helper from "./helper";
import * as app from "./app";
import * as payment from "./payment";
import * as color from "./color";
import * as assets from "./assets";
import * as currency from "./currency";

export default {
  assets,
  helper,
  payment,
  app,
  color,
  mixin,
  currency,
  time: { ...utils.time },
  number: { ...utils.number },
};
