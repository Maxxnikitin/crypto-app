import { getPools, getPoolsWithFarming, getToken } from "@/utils/api";
import { convertToDaysAndHours, findMaxRemainingDays } from "@/utils/helpers";
import { Asset, TFrontPool, TSwapTokensData } from "@/utils/types";
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
      const {
        rewardsTotal,
        rewards24,
        rewardsTotalUsd,
        rewards24Usd,
        rewardsPerCoin,
      } = rewards.reduce<
        Pick<
          TFrontPool,
          | "rewardsTotal"
          | "rewards24"
          | "rewardsTotalUsd"
          | "rewards24Usd"
          | "rewardsPerCoin"
        >
      >(
        (acc, item) => {
          if (item.status !== "active") return acc;

          const { decimals, dex_usd_price, symbol } = tokensMap[item.address];

          const remainingRewards = +item.remaining_rewards / 10 ** decimals;
          const rewardRate24 = +item.reward_rate_24h / 10 ** decimals;

          acc.rewardsTotal += remainingRewards;
          acc.rewardsTotalUsd += remainingRewards * +dex_usd_price;
          acc.rewards24 += rewardRate24;
          acc.rewards24Usd += rewardRate24 * +dex_usd_price;

          acc.rewardsPerCoin.push({
            symbol,
            rewards24Usd: rewardRate24 * +dex_usd_price,
            remainingDaysForTokenString: convertToDaysAndHours(
              remainingRewards / rewardRate24
            ),
            remainingDaysForToken: remainingRewards / rewardRate24,
          });

          return acc;
        },
        {
          rewardsTotal: 0,
          rewards24: 0,
          rewardsTotalUsd: 0,
          rewards24Usd: 0,
          rewardsPerCoin: [],
        }
      );

      if (!rewardsTotalUsd) break;

      const maxRewardsDays = findMaxRemainingDays(rewardsPerCoin);

      data.push({
        tvl: +pools[i].pool.lp_total_supply_usd,
        apr: +actualPoolsWithFarming[i].apy * 100,
        rewardsTotal,
        rewardsTotalUsd,
        rewards24,
        rewards24Usd,
        remainingDaysForTokenString:
          maxRewardsDays?.remainingDaysForTokenString,
        remainingDaysForToken: maxRewardsDays?.remainingDaysForToken,
        rewardsPerCoin,
        lockedTotalLp: actualPoolsWithFarming[i].locked_total_lp,
        lockedTotalLpUsd: actualPoolsWithFarming[i].locked_total_lp_usd,
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

    // собираем данные по usdt и ton, чтобы на фронте удобно считать сразу

    const swapTokensData: TSwapTokensData = { TON: {}, USDT: {} };

    for (let key in tokensMap) {
      if (
        tokensMap[key].display_name === "Tether USD" &&
        !swapTokensData.USDT.dex_usd_price
      ) {
        swapTokensData.USDT.dex_usd_price = tokensMap[key].dex_usd_price;
        swapTokensData.USDT.image_url = tokensMap[key].image_url;
      }

      if (
        tokensMap[key].display_name === "TON" &&
        !swapTokensData.TON.dex_usd_price
      ) {
        swapTokensData.TON.dex_usd_price = tokensMap[key].dex_usd_price;
        swapTokensData.TON.image_url = tokensMap[key].image_url;
      }

      if (
        swapTokensData.TON.dex_usd_price &&
        swapTokensData.USDT.dex_usd_price
      ) {
        break;
      }
    }

    res.status(200).json({
      data: {
        data,
        swapTokensData,
      },
      message: "success",
    });
  } catch (e) {
    const error = e as AxiosError;
    res.status(error.response?.status ?? 405).json({ message: error.message });
  }
}
