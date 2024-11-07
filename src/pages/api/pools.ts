import { getPools, getPoolsWithFarming, getToken } from "@/utils/api";
import { Asset } from "@/utils/types";
import { AxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  data?: unknown;
  message: string;
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const poolsWithFarming = await getPoolsWithFarming();

    const actualPoolsWithFarming = poolsWithFarming.farm_list.filter(
      ({ status }) => status === "operational"
    );

    const pools = await Promise.all(
      actualPoolsWithFarming.map(({ pool_address }) => getPools(pool_address))
    );

    /**
     * чтобы запросить все токены одновременно (по 2 в каждом пуле), сначала собираем линейный массив
     */
    const tempTokens = [];

    for (let i = 0; i < pools.length; i++) {
      const { token0_address, token1_address } = pools[i].pool;

      tempTokens.push(token0_address, token1_address);
    }

    /**
     * затем делаем запрос
     */
    const tokens = await Promise.all(
      tempTokens.map((address) => getToken(address))
    );

    /**
     * собираем в мапу все адреса монет и результаты, чтобы потом считать rewards
     */
    const tokensMap: Record<string, Asset> = {};

    for (let i = 0; i < tempTokens.length; i++) {
      if (tokensMap[tempTokens[i]]) continue;

      tokensMap[tempTokens[i]] = tokens[i].asset;
    }

    /**
     * получаем недостающие токены для рассчётов rewards
     */
    const tempTokensRewards = actualPoolsWithFarming.reduce<Set<string>>(
      (acc, item) => {
        item.rewards.forEach((reward) => {
          if (!tokensMap[reward.address]) {
            acc.add(reward.address);
          }
        });

        return acc;
      },
      new Set()
    );

    const tempTokensRewardsArray = Array.from(tempTokensRewards);

    /**
     * запрашиваем данные
     */
    const tokensRewards = await Promise.all(
      tempTokensRewardsArray.map((address) => getToken(address))
    );

    /**
     * добавляем в мапу
     */
    for (let i = 0; i < tempTokensRewardsArray.length; i++) {
      tokensMap[tempTokensRewardsArray[i]] = tokensRewards[i].asset;
    }

    /**
     * затем собираем общую дату, при этом для каждого пула берём два элемента из tempTokens
     */
    const data = [];
    let tokenIndex = 0;

    for (let i = 0; i < pools.length; i++) {
      const { rewards } = actualPoolsWithFarming[i];
      const { rewardsTotal, rewards24 } = rewards.reduce<
        Record<"rewardsTotal" | "rewards24", number>
      >(
        (acc, item) => {
          if (item.status !== "active") return acc;

          const { decimals, dex_usd_price } = tokensMap[item.address];

          acc.rewardsTotal +=
            (+item.remaining_rewards / 10 ** decimals) * +dex_usd_price;
          acc.rewards24 +=
            (+item.reward_rate_24h / 10 ** decimals) * +dex_usd_price;

          return acc;
        },
        { rewardsTotal: 0, rewards24: 0 }
      );

      data.push({
        tvl: +pools[i].pool.lp_total_supply_usd,
        apr: +actualPoolsWithFarming[i].apy * 100,
        rewardsTotal,
        rewards24,
        token0: {
          image: tokens[tokenIndex].asset.image_url,
          symbol: tokens[tokenIndex].asset.symbol,
        },
        token1: {
          image: tokens[tokenIndex + 1].asset.image_url,
          symbol: tokens[tokenIndex + 1].asset.symbol,
        },
      });
      tokenIndex += 2;
    }

    res.status(200).json({ data, message: "success" });
  } catch (e) {
    const error = e as AxiosError;
    res.status(error.response?.status ?? 405).json({ message: error.message });
  }
}
