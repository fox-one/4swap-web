declare namespace API {
  export interface Asset {
    chain: Chain;
    chain_id: string;
    chainLogo: string;
    id: string;
    logo: string;
    name: string;
    symbol: string;
    price: string;
    balance: string;
    display_symbol: string;
    promotion?: {
      label: string;
      url: string;
      color: string;
    };
  }

  export interface Fiat {
    code: string;
    rate: number;
  }

  export interface Chain {
    chain_id: string;
    id: string;
    logo: string;
    name: string;
    symbol: string;
  }

  export interface MixinAsset {
    asset_id: string;
    asset_key: string;
    balance: string;
    capitalization: number;
    chain_id: string;
    change_btc: string;
    change_usd: string;
    confirmations: number;
    destination: string;
    icon_url: string;
    mixin_id: string;
    name: string;
    price_btc: string;
    price_usd: string;
    reserve: string;
    symbol: string;
    tag: string;
    type: string;
  }
}
