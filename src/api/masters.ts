import axiosInstance from "./axiosInstance";
import { OTHER_OPTION, BANK_NAMES } from "../constants/masters";
import type { MasterKey, Masters } from "../constants/masters";

export interface MastersApiResponse {
  success: boolean;
  data: Masters;
}
const normalizeBankNames = (raw: unknown): string[] => {
  if (!Array.isArray(raw)) return [];
  const names: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const name = item.trim();
    // Skip empties, the "Other" sentinel (appended below) and duplicates.
    if (!name || name.toLowerCase() === OTHER_OPTION.toLowerCase()) continue;
    if (names.some(b => b.toLowerCase() === name.toLowerCase())) continue;
    names.push(name);
  }
  return names;
};

const bankNamesToBanks = (names: string[]): Masters["banks"] =>
  names.length > 0 ? [...names, OTHER_OPTION] : [...BANK_NAMES];

const withBankMaster = (data: Masters): Masters => {
  const names = normalizeBankNames((data as Masters & { bankNames?: unknown }).bankNames);
  return names.length > 0 ? { ...data, banks: bankNamesToBanks(names) } : data;
};

let mastersPromise: Promise<Masters> | null = null;

export const fetchMasters = (): Promise<Masters> => {
  if (!mastersPromise) {
    mastersPromise = axiosInstance
      .get<MastersApiResponse>("/masters")
      .then((res) => withBankMaster(res.data.data))
      .catch((err) => {
        mastersPromise = null;
        throw err;
      });
  }
  return mastersPromise;
};

export const fetchMasterByType = async (type: MasterKey): Promise<Masters[MasterKey]> => {
  const res = await axiosInstance.get<{ success: boolean; data: Masters[MasterKey] }>(`/masters/${type}`);
  if (type !== "banks") return res.data.data;
  return bankNamesToBanks(normalizeBankNames(res.data.data)) as Masters[typeof type];
};

export interface CustomBankNameResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export const addCustomBankName = async (value: string): Promise<CustomBankNameResponse> => {
  const res = await axiosInstance.post<CustomBankNameResponse>(
    "/masters/bankNames/custom",
    { value }
  );
  return res.data;
};
