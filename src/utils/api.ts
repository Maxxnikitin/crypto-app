import axios, { AxiosResponse } from "axios";
import { TGetPoolsRes, TGetPoolsWithFarmingRes, TGetTokenRes } from "./types";

export const checkResponse: <T>(res: AxiosResponse<T>) => T | Promise<T> = (
  res
) => {
  if (res.status.toString().startsWith("2")) {
    return res.data;
  }
  return Promise.reject(res);
};

const stonFiInstance = axios.create({
  baseURL: process.env.STONFI_API_URL,
  headers: {
    accept: "application/json",
  },
});

export const getPoolsWithFarming = () =>
  stonFiInstance
    .get("/v1/farms")
    .then((res: AxiosResponse<TGetPoolsWithFarmingRes>) => checkResponse(res));

export const getPools = (address: string) =>
  stonFiInstance
    .get(`/v1/pools/${address}`)
    .then((res: AxiosResponse<TGetPoolsRes>) => checkResponse(res));

export const getToken = (address: string) =>
  stonFiInstance
    .get(`/v1/assets/${address}`)
    .then((res: AxiosResponse<TGetTokenRes>) => checkResponse(res));
