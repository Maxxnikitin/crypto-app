import { getPools, getPoolsWithFarming, getToken } from "@/utils/api";
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

    // actualPoolsWithFarming.forEach((item) => console.log(item.rewards));

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
     * затем собираем общую дату, при этом для каждого пула берём два элемента из tempTokens
     */
    const data = [];
    let tokenIndex = 0;

    for (let i = 0; i < pools.length; i++) {
      data.push({
        tvl: +pools[i].pool.lp_total_supply_usd,
        apr: +actualPoolsWithFarming[i].apy * 100,
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
