import axios, { AxiosResponse } from "axios";
import { TCoinPriceRes, TCoinsListRes } from "./types";

export const checkResponse: <T>(res: AxiosResponse<T>) => T | Promise<T> = (
  res
) => {
  if (res.status.toString().startsWith("2")) {
    return res.data;
  }
  return Promise.reject(res);
};

const coinMarketInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_COIN_MARKET_API_URL,
  headers: {
    "Content-Type": "application/json",
    "X-CMC_PRO_API_KEY": process.env.NEXT_PUBLIC_COIN_MARKET_API_KEY,
  },
});

export const getCoinsList = (offset?: number) =>
  coinMarketInstance
    .get(`/v1/cryptocurrency/map?limit=5000&start=${offset ?? 1}`, {
      method: "GET",
      headers: { accept: "application/json" },
    })
    .then((res: AxiosResponse<TCoinsListRes>) => checkResponse(res));

export const getCoinQuote = (id: number) =>
  coinMarketInstance
    .get(`/v2/cryptocurrency/quotes/latest?id=${id}`, {
      method: "GET",
      headers: { accept: "application/json" },
    })
    .then((res: AxiosResponse<TCoinPriceRes>) => checkResponse(res));
