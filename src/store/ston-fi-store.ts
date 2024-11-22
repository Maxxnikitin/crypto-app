import { getPoolsRequest } from "@/utils/api-front";
import { TFrontPool, TSwapTokensData } from "@/utils/types";
import { create } from "zustand";

type TStore = {
  pools: TFrontPool[] | null;
  swapTokensData: TSwapTokensData | null;
  currentPool: TFrontPool | null;
  isPoolsLoading: boolean;

  getPools: () => Promise<void>;
  setCurrentPool: (data: TFrontPool) => void;
};

export const useStonFiStore = create<TStore>((set) => ({
  pools: null,
  swapTokensData: null,
  currentPool: null,
  isPoolsLoading: false,

  getPools: async () => {
    set({ isPoolsLoading: true });
    try {
      const { data } = await getPoolsRequest();

      set({
        pools: data.data,
        swapTokensData: data.swapTokensData,
        isPoolsLoading: false,
      });
    } catch (e) {
      console.log(e);
      set({ isPoolsLoading: false });
    }
  },

  setCurrentPool: (currentPool) => {
    set({ currentPool });
  },
}));
