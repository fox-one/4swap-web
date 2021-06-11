export function convertPairOrder(base, pair) {
  if (base === pair.base_asset_id) {
    return pair;
  }
  return {
    ...pair,
    base_amount: pair.quote_amount,
    base_asset_id: pair.quote_asset_id,
    base_value: pair.quote_value,
    quote_amount: pair.base_amount,
    quote_asset_id: pair.base_asset_id,
    quote_value: pair.base_value,
  };
}
