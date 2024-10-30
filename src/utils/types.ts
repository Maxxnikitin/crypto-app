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
    coin1FeesInDollar: number;
    coin2FeesInDollar: number;
    apr: number;
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

// Удалисть всё, что до этого

export type TGetPoolsWithFarmingRes = {
  farm_list: FarmList[];
};

export type FarmList = {
  apy: string;
  locked_total_lp: string;
  locked_total_lp_usd: string;
  min_stake_duration_s: string;
  minter_address: string;
  nft_infos: NftInfo[];
  pool_address: string;
  reward_token_address: string;
  rewards: FarmListReward[];
  status: string;
};

export type NftInfo = {
  address: string;
  create_timestamp: string;
  min_unstake_timestamp: string;
  nonclaimed_rewards: string;
  rewards: NftInfoReward[];
  staked_tokens: string;
  status: string;
};

export type NftInfoReward = {
  address: string;
  amount: string;
};

export type FarmListReward = {
  address: string;
  remaining_rewards: string;
  reward_rate_24h: string;
  status: string;
};

export type TGetPoolsRes = {
  pool: TPool;
};

export type TPool = {
  address: string;
  apy_1d: string;
  apy_30d: string;
  apy_7d: string;
  collected_token0_protocol_fee: string;
  collected_token1_protocol_fee: string;
  deprecated: boolean;
  lp_account_address: string;
  lp_balance: string;
  lp_fee: string;
  lp_price_usd: string;
  lp_total_supply: string;
  lp_total_supply_usd: string;
  lp_wallet_address: string;
  protocol_fee: string;
  protocol_fee_address: string;
  ref_fee: string;
  reserve0: string;
  reserve1: string;
  router_address: string;
  token0_address: string;
  token0_balance: string;
  token1_address: string;
  token1_balance: string;
};

export type TGetTokenRes = {
  asset: Asset;
};

export type Asset = {
  balance: string;
  blacklisted: boolean;
  community: boolean;
  contract_address: string;
  custom_payload_api_uri: string;
  decimals: number;
  default_symbol: boolean;
  deprecated: boolean;
  dex_price_usd: string;
  dex_usd_price: string;
  display_name: string;
  extensions: string[];
  image_url: string;
  kind: string;
  priority: number;
  symbol: string;
  tags: string[];
  taxable: boolean;
  third_party_price_usd: string;
  third_party_usd_price: string;
  wallet_address: string;
};

export type TFullPool = TPool & {
  gotTokens: {
    token0: Asset;
    token1: Asset;
  };
  farming: FarmList;
};

export type TFullPoolsRes = {
  data: TFullPool[];
  message: string;
};
