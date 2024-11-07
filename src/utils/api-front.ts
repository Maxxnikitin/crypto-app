import axios, { AxiosResponse } from "axios";
import { TFrontPoolsRes } from "./types";

export const checkResponse: <T>(res: AxiosResponse<T>) => T | Promise<T> = (
  res
) => {
  if (res.status.toString().startsWith("2")) {
    return res.data;
  }
  return Promise.reject(res);
};

export const getPoolsRequest = () =>
  axios
    .get("/api/pools")
    .then((res: AxiosResponse<TFrontPoolsRes>) => checkResponse(res));
