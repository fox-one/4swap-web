export const ERROR_CODE = {
  /***
   *  因为没深度
   *  */
  InsufficientLiquiditySwapped: 20001,
  /**
   *  因为下单 funds 数量不合适
   * */
  InsufficientFundsSwapped: 20002,
  /***
   *   Swap 超出滑点
   *  */
  SlippageOutSwapped: 20003,
  /***
   *  Add Liquidity 超出滑点
   */
  SlippageOutDeposit: 20004,
  /***
   *  首次添加数量太少
   */
  InsufficientFundsDeposit: 20005,
  /**
   * 加注太多，lp token不够了
   */
  InsufficientLiquidity: 20006,
};
