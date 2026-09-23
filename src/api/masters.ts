import axiosInstance from "./axiosInstance";
import type { MasterKey, Masters } from "../constants/masters";

export interface MastersApiResponse {
  success: boolean;
  data: Masters;
}

let mastersPromise: Promise<Masters> | null = null;

export const fetchMasters = (): Promise<Masters> => {
  if (!mastersPromise) {
    mastersPromise = axiosInstance
      .get<MastersApiResponse>("/masters")
      .then((res) => res.data.data)
      .catch((err) => {
        mastersPromise = null;
        throw err;
      });
  }
  return mastersPromise;
};

export const fetchMasterByType = async (type: MasterKey): Promise<Masters[MasterKey]> => {
  const res = await axiosInstance.get<{ success: boolean; data: Masters[MasterKey] }>(`/masters/${type}`);
  return res.data.data;
};
