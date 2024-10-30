import { getPoolsRequest } from "@/utils/api-front";
import { TFullPool } from "@/utils/types";
import { create } from "zustand";

type TStore = {
  pools: TFullPool[] | null;
  isPoolsLoading: boolean;

  getPools: () => Promise<void>;
};

export const useStonFiStore = create<TStore>((set) => ({
  pools: null,
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
}));
