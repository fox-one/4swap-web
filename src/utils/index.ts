import utils, { mixin } from "@foxone/utils";
import * as helper from "./helper";
import * as account from "./account";
import * as app from "./app";
import * as payment from "./payment";
import * as color from "./color";
import * as assets from "./assets";
import * as currency from "./currency";
import * as pair from "./pair/helper";
import { simplize, attachSign } from "./number";

export default {
  account,
  assets,
  helper,
  payment,
  app,
  color,
  mixin,
  currency,
  pair,
  time: { ...utils.time },
  number: { ...utils.number, simplize, attachSign },
};
