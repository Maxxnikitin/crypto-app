import { PoolData } from "@dedust/sdk";

export type TCoinsList = {
  first_historical_data: string;
  id: number;
  is_active: number;
  last_historical_data: string;
  name: string;
  platform?: {
    id: number;
    name: string;
    slug: string;
    symbol: string;
    token_address: string;
  };
  rank: number;
  slug: string;
  symbol: string;
};

export type TCoinsListRes = {
  data: TCoinsList[];
};

export type TFullPoolData = PoolData & {
  addition: {
    tvl: number;
    coin1Rate: number;
    coin2Rate: number;
    coin1InDollar: number;
    coin2InDollar: number;
    coin1VolumeInDollar: number;
    coin2VolumeInDollar: number;
    commonVolume: number;
  };
};

export type TCoinPrice = {
  [key: number]: {
    circulating_supply: number;
    cmc_rank: null;
    date_added: Date;
    id: number;
    infinite_supply: boolean;
    is_active: number;
    is_fiat: number;
    last_updated: Date;
    max_supply: null;
    name: string;
    num_market_pairs: number;
    platform: null;
    quote: {
      USD: {
        fully_diluted_market_cap: number;
        last_updated: Date;
        market_cap: number;
        market_cap_dominance: number;
        percent_change_1h: number;
        percent_change_7d: number;
        percent_change_24h: number;
        percent_change_30d: number;
        percent_change_60d: number;
        percent_change_90d: number;
        price: number;
        tvl: null;
        volume_24h: number;
        volume_change_24h: number;
      };
    };
    self_reported_circulating_supply: number;
    self_reported_market_cap: number;
    slug: string;
    symbol: string;
    total_supply: number;
    tvl_ratio: null;
  };
};

export type TCoinPriceRes = {
  data: TCoinPrice;
};
