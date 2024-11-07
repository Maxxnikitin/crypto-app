import { getPoolsRequest } from "@/utils/api-front";
import { TFrontPool } from "@/utils/types";
import { create } from "zustand";

type TStore = {
  pools: TFrontPool[] | null;
  currentPool: TFrontPool | null;
  isPoolsLoading: boolean;

  getPools: () => Promise<void>;
  setCurrentPool: (data: TFrontPool) => void;
};

export const useStonFiStore = create<TStore>((set) => ({
  pools: null,
  currentPool: null,
  isPoolsLoading: false,

  getPools: async () => {
    set({ isPoolsLoading: true });
    try {
      const { data } = await getPoolsRequest();

      set({
        pools: data,
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
