import { TonClient } from "@ton/ton";
import { create } from "zustand";

type TStore = {
  balance: number | null;
  tonWebClient: TonClient | null;

  saveBalance: (balance: number) => void;
  saveTonWebClient: (tonWebClient: TonClient) => void;
};

export const useTonWebStore = create<TStore>((set) => ({
  balance: null,
  tonWebClient: null,

  saveBalance: (balance) => set({ balance }),

  saveTonWebClient: (tonWebClient) => set({ tonWebClient }),
}));
