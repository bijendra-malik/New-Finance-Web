import axios from "axios";
import axiosInstance from "./axiosInstance";
import { OTHER_OPTION, BANK_NAMES } from "../constants/masters";
import type { Masters } from "../constants/masters";

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
  const names = normalizeBankNames((data as Masters & { banks?: unknown }).banks);
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

export interface LocationMasterResponse {
  success: boolean;
  data: { _id: string; name: string }[];
}

// GET /masters/location/continents → continents seeded in location masters.
export interface Continent {
  _id: string;
  name: string;
  slug?: string;
  status?: string;
}

// GET /masters/location/countries → countries (optionally filtered by continentId).
export interface Country {
  _id: string;
  name: string;
  isoCode?: string;
  continentId?: string;
  slug?: string;
  status?: string;
}

let continentsPromise: Promise<Continent[]> | null = null;
export const fetchContinents = (): Promise<Continent[]> => {
  if (!continentsPromise) {
    continentsPromise = axiosInstance
      .get<LocationMasterResponse>("/masters/location/continents")
      .then((res) => res.data.data)
      .catch((err) => {
        continentsPromise = null;
        throw err;
      });
  }
  return continentsPromise;
};

const countriesByContinentPromises = new Map<string, Promise<Country[]>>();
export const fetchCountriesByContinent = (continentId: string): Promise<Country[]> => {
  let promise = countriesByContinentPromises.get(continentId);
  if (!promise) {
    promise = axiosInstance
      .get<LocationMasterResponse>("/masters/location/countries", { params: { continentId } })
      .then((res) => res.data.data)
      .catch((err) => {
        countriesByContinentPromises.delete(continentId);
        throw err;
      });
    countriesByContinentPromises.set(continentId, promise);
  }
  return promise;
};

export interface PincodeInfoResponse {
  success: boolean;
  message?: string;
  data: {
    pincode: string;
    city: string;
    cityId: string;
    state: string;
    stateId: string;
    country: string;
    countryId: string;
    continent: string;
    continentId: string;
  };
}

export interface PincodeVerification {
  exists: boolean;
  message?: string;
  info?: PincodeInfoResponse["data"];
}


export const INDIA = "India";

const nameToId = (list: { _id: string; name: string }[], name: string): string | null =>
  list.find(item => item.name.toLowerCase() === name.trim().toLowerCase())?._id ?? null;

let countryIdPromise: Promise<string> | null = null;
const getCountryId = (country = INDIA): Promise<string> => {
  if (!countryIdPromise) {
    countryIdPromise = axiosInstance
      .get<LocationMasterResponse>("/masters/location/countries")
      .then((res) => {
        const id = nameToId(res.data.data, country);
        if (!id) throw new Error(`Country "${country}" not found in location masters`);
        return id;
      })
      .catch((err) => {
        countryIdPromise = null;
        throw err;
      });
  }
  return countryIdPromise;
};

const statesByCountryPromises = new Map<string, Promise<LocationMasterResponse["data"]>>();
const fetchStateRecords = (countryId: string): Promise<LocationMasterResponse["data"]> => {
  let promise = statesByCountryPromises.get(countryId);
  if (!promise) {
    promise = axiosInstance
      .get<LocationMasterResponse>("/masters/location/states", { params: { countryId } })
      .then((res) => res.data.data)
      .catch((err) => {
        statesByCountryPromises.delete(countryId);
        throw err;
      });
    statesByCountryPromises.set(countryId, promise);
  }
  return promise;
};

const stateIdPromises = new Map<string, Promise<string>>();
const getStateId = (state: string): Promise<string> => {
  const key = state.trim().toLowerCase();
  let promise = stateIdPromises.get(key);
  if (!promise) {
    promise = getCountryId()
      .then((countryId) =>
        fetchStateRecords(countryId).then((records) => {
          const id = nameToId(records, state);
          if (!id) throw new Error(`State "${state}" not found`);
          return id;
        })
      )
      .catch((err) => {
        stateIdPromises.delete(key);
        throw err;
      });
    stateIdPromises.set(key, promise);
  }
  return promise;
};

let statesPromise: Promise<string[]> | null = null;
export const fetchStatesByCountry = (): Promise<string[]> => {
  if (!statesPromise) {
    statesPromise = getCountryId()
      .then((countryId) => fetchStateRecords(countryId).then(records => records.map(s => s.name)))
      .catch((err) => {
        statesPromise = null;
        throw err;
      });
  }
  return statesPromise;
};

const citiesPromises = new Map<string, Promise<string[]>>();
export const fetchCitiesByState = (state: string): Promise<string[]> => {
  const key = state.trim().toLowerCase();
  let promise = citiesPromises.get(key);
  if (!promise) {
    promise = getStateId(state)
      .then((stateId) =>
        axiosInstance
          .get<LocationMasterResponse>("/masters/location/cities", { params: { stateId } })
          .then((res) => res.data.data.map(c => c.name))
      )
      .catch((err) => {
        citiesPromises.delete(key);
        throw err;
      });
    citiesPromises.set(key, promise);
  }
  return promise;
};

// GET /masters/location/pincode/{pincode} → resolve or report unknown pincodes.
const pincodePromises = new Map<string, Promise<PincodeVerification>>();
export const verifyPincode = (pincode: string): Promise<PincodeVerification> => {
  const key = pincode.trim();
  let promise = pincodePromises.get(key);
  if (!promise) {
    promise = axiosInstance
      .get<PincodeInfoResponse>(`/masters/location/pincode/${encodeURIComponent(key)}`)
      .then((res) => ({ exists: true, info: res.data.data }))
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          // Known-negative: cache so re-checks don't re-hit the server.
          const verification: PincodeVerification = {
            exists: false,
            message: (err.response.data as { message?: string } | undefined)?.message,
          };
          pincodePromises.set(key, Promise.resolve(verification));
          return verification;
        }
        pincodePromises.delete(key);
        throw err;
      });
    pincodePromises.set(key, promise);
  }
  return promise;
};

export const clearPincodeCache = (pincode?: string): void => {
  if (pincode) pincodePromises.delete(pincode.trim());
  else pincodePromises.clear();
};

// GET /employment-types/{loanType} → employment types registered for that loan.
export interface EmploymentTypesResponse {
  success: boolean;
  data: { loanType: string; employmentTypes: string[] };
}

const employmentTypesPromises = new Map<string, Promise<string[]>>();
export const fetchEmploymentTypes = (loanType: string): Promise<string[]> => {
  const key = loanType.trim().toLowerCase();
  let promise = employmentTypesPromises.get(key);
  if (!promise) {
    promise = axiosInstance
      .get<EmploymentTypesResponse>(`/employment-types/${key}`)
      .then((res) => res.data.data.employmentTypes)
      .catch((err) => {
        employmentTypesPromises.delete(key);
        throw err;
      });
    employmentTypesPromises.set(key, promise);
  }
  return promise;
};

export const getEmploymentTypes = async (
  loanType: string,
  fallback: readonly string[]
): Promise<string[]> => {
  try {
    const types = await fetchEmploymentTypes(loanType);
    return types.length > 0 ? types : [...fallback];
  } catch {
    return [...fallback];
  }
};

export interface CustomBankNameResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export const addCustomBankName = async (value: string): Promise<CustomBankNameResponse> => {
  const res = await axiosInstance.post<CustomBankNameResponse>(
    "/masters/banks/custom",
    { value }
  );
  return res.data;
};
