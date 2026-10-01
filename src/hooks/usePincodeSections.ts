import { useCallback, useRef, useState } from "react";

export const PINCODE_CITY_MISMATCH = "Selected city does not match the verified pincode";

export interface VerifiedPincode {
  pincode: string;
  city: string;
}

export const PINCODE_SECTIONS = {
  residence:          { pincodeKey: "pincode",                   stateKey: "state",                   cityKey: "city" },
  business:           { pincodeKey: "businessPincode",           stateKey: "businessState",           cityKey: "businessCity" },
  buyingProperty:     { pincodeKey: "buyingPropertyPincode",     stateKey: "buyingPropertyState",     cityKey: "buyingPropertyCity" },
  collateralProperty: { pincodeKey: "collateralPropertyPincode", stateKey: "collateralPropertyState", cityKey: "collateralPropertyCity" },
  leaseProperty:      { pincodeKey: "leasePropertyPincode",      stateKey: "leasePropertyState",      cityKey: "leasePropertyCity" },
  parent:             { pincodeKey: "parentPincode",             stateKey: "parentState",             cityKey: "parentCity" },
} as const;

export type PincodeSectionName = keyof typeof PINCODE_SECTIONS;

interface UsePincodeSectionsArgs {
  set: (key: string, value: string) => void;
  loadCities: (state: string) => string[];
  sections: readonly PincodeSectionName[];
}

interface UsePincodeSectionsResult {
  onPincodeResolved: (prefix: PincodeSectionName, r: { pincode: string; state: string; city: string }) => void;
  mismatchErrors: (draft: object) => Record<string, string>;
}

export const usePincodeSections = ({ set, loadCities, sections }: UsePincodeSectionsArgs): UsePincodeSectionsResult => {
  const [verified, setVerified] = useState<Partial<Record<PincodeSectionName, VerifiedPincode>>>({});

  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;
  const setRef = useRef(set);
  setRef.current = set;
  const loadRef = useRef(loadCities);
  loadRef.current = loadCities;

  const onPincodeResolved = useCallback<UsePincodeSectionsResult["onPincodeResolved"]>((prefix, r) => {
    const section = PINCODE_SECTIONS[prefix];
    if (!section || !sectionsRef.current.includes(prefix)) return;
    if (r.state && r.city) {
      setRef.current(section.stateKey, r.state);
      setRef.current(section.cityKey, r.city);
      loadRef.current(r.state);
      setVerified(prev => ({ ...prev, [prefix]: { pincode: r.pincode, city: r.city } }));
    } else {
      setVerified(prev => ({ ...prev, [prefix]: null }));
    }
  }, []);

  const mismatchErrors = useCallback<UsePincodeSectionsResult["mismatchErrors"]>((draft) => {
    const errors: Record<string, string> = {};
    const record = draft as Record<string, unknown>;
    for (const prefix of sectionsRef.current) {
      const verifiedPin = verified[prefix];
      if (!verifiedPin) continue;
      const { cityKey, pincodeKey } = PINCODE_SECTIONS[prefix];
      const city = record[cityKey];
      if (typeof city === "string" && city && city !== verifiedPin.city)
        errors[pincodeKey] = PINCODE_CITY_MISMATCH;
    }
    return errors;
  }, [verified]);

  return { onPincodeResolved, mismatchErrors };
};
