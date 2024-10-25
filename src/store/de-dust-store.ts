import { getCoinQuote, getCoinsList } from "@/utils/api";
import { TCoinsList, TFullPoolData } from "@/utils/types";
import { DeDustClient } from "@dedust/sdk";
import { create } from "zustand";
import { AxiosError } from "axios";

type TStore = {
  deDustClient: DeDustClient | null;
  pools: TFullPoolData[] | null;
  coinsMap: Map<string, number> | null;
  isPoolsLoading: boolean;
  isPoolsBackgroundLoading: boolean;

  saveDeDustClient: (deDustClient: DeDustClient) => void;
  getPools: () => Promise<void>;
  // getCoins: () => Promise<void>;
};

export const useDeDustStore = create<TStore>((set) => ({
  deDustClient: null,
  pools: null,
  coinsMap: null,
  isPoolsLoading: false,
  isPoolsBackgroundLoading: false,

  saveDeDustClient: (deDustClient) => set({ deDustClient }),

  // getCoins: async () => {
  //   try {
  //     let offcet = 1;
  //     let res: TCoinsList[] = [];

  //     while (true) {
  //       const coinsList = await getCoinsList(offcet);

  //       res = res.concat(coinsList.data);

  //       if (coinsList.data.length === 5000) {
  //         offcet += 5000;
  //       } else {
  //         break;
  //       }
  //     }

  //     const coinsMap = new Map();

  //     res.forEach(({ name, id }) => coinsMap.set(name, id));

  //     set({ coinsMap });

  //     // coinsList.data.slice(0, 10).forEach(({ id }) => {
  //     //   getCoinQuote(id);
  //     // });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // },

  getPools: async () => {
    const deDustClient = new DeDustClient({
      endpointUrl: "https://api.dedust.io",
    });

    set({ isPoolsLoading: true });

    const prevData = localStorage.getItem("prevPools");

    if (prevData && prevData.length) {
      const data = JSON.parse(prevData);

      set({
        pools: data,
        isPoolsLoading: false,
        isPoolsBackgroundLoading: true,
      });
    }

    // const [pools] = await Promise.all([
    //   deDustClient.getPools(),
    //   get().getCoins(),
    // ]);

    const pools = await deDustClient.getPools();

    // const { coinsMap } = get();

    const filteredPools: TFullPoolData[] = [];
    let index = 0;

    while (index < pools.length) {
      if (
        !pools[index].assets[0].metadata ||
        !pools[index].assets[1].metadata
      ) {
        index++;
        continue;
      }

      /**
       * временно решили брать только пулы с USDT, чтобы не запрашивать курсы монет
       */

      const isFirstUSDT = pools[index].assets[0].metadata.symbol === "USDT";
      const isSecondUSDT = pools[index].assets[1].metadata.symbol === "USDT";

      if (!isFirstUSDT && !isSecondUSDT) {
        index++;
        continue;
      }

      // const coin1Id = coinsMap?.get(pools[index].assets[0].metadata.name);
      // const coin2Id = coinsMap?.get(pools[index].assets[1].metadata.name);

      // if (!coin1Id || !coin2Id) {
      //   index++;
      //   continue;
      // }

      // try {
      // const [{ data: coin1Data }, { data: coin2Data }] = await Promise.all([
      //   getCoinQuote(coinsMap?.get(pools[index].assets[0].metadata.name)!),
      //   getCoinQuote(coinsMap?.get(pools[index].assets[1].metadata.name)!),
      // ]);

      const price1 = isFirstUSDT ? 1 : +pools[index].lastPrice;
      const price2 = isSecondUSDT ? 1 : +pools[index].lastPrice;

      const coin1InDollar =
        (+pools[index].reserves[0] /
          10 ** pools[index].assets[0].metadata.decimals) *
        price1;
      const coin2InDollar =
        (+pools[index].reserves[1] /
          10 ** pools[index].assets[1].metadata.decimals) *
        price2;

      const coin1VolumeInDollar =
        (+pools[index].stats.volume[0] /
          10 ** pools[index].assets[0].metadata.decimals) *
        price1;

      const coin2VolumeInDollar =
        (+pools[index].stats.volume[1] /
          10 ** pools[index].assets[1].metadata.decimals) *
        price2;

      const addition = {
        coin1Rate: price1,
        coin2Rate: price2,
        coin1InDollar,
        coin2InDollar,
        tvl: coin1InDollar + coin2InDollar,
        coin1VolumeInDollar,
        coin2VolumeInDollar,
        commonVolume: coin1VolumeInDollar + coin2VolumeInDollar,
      };

      filteredPools.push({ ...pools[index], addition });

      index++;
      // } catch (e) {
      //   const error = e as AxiosError;
      //   if ((error.status = 429)) {
      //     break;
      //   }
      //   console.log(e);
      // }
    }

    const filteredAndSortedPools = filteredPools.sort(
      (a, b) => b.addition.commonVolume - a.addition.commonVolume
    );

    localStorage.setItem("prevPools", JSON.stringify(filteredAndSortedPools));

    set({
      deDustClient,
      pools: filteredAndSortedPools,
      isPoolsLoading: false,
      isPoolsBackgroundLoading: false,
    });
  },
}));
