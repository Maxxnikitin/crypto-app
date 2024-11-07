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

export type TFrontPool = {
  tvl: number;
  apr: number;
  token0: {
    image: string;
    symbol: string;
  };
  token1: {
    image: string;
    symbol: string;
  };
};

export type TFrontPoolsRes = {
  data: TFrontPool[];
  message: string;
};
