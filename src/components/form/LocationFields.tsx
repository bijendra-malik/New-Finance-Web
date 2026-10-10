// Pincode-first location block reused by franchise and loan address sections.

import { useMemo, useState } from "react";
import { Field, SelectField, TextField } from "../ui/FieldRenderer";
import { PincodeInputField } from "./FormControls";

export interface LocationSlice {
  state: string;
  city: string;
}

interface LocationFieldsProps {
  slice: LocationSlice;
  set: (key: keyof LocationSlice, value: string) => void;
  errors: Partial<Record<keyof LocationSlice, string>>;
  states: readonly string[];
  loadCities: (state: string) => string[];

  onPincodeResolved: (r: { pincode: string; state: string; city: string }) => void;
  entityLabel?: string;
  showPincode?: boolean;
  pincodeStatus?: "idle" | "verifying" | "notFound" | "error";
  verifiedLocation?: { pincode: string; state: string; city: string } | null;
}

export const LocationFields = ({
  slice,
  set,
  errors,
  states,
  loadCities,
  onPincodeResolved,
  entityLabel = "",
  showPincode = true,
  pincodeStatus = "idle",
  verifiedLocation = null,
}: LocationFieldsProps) => {
  const [, setUserCity] = useState<string>(slice.city);
  const cityOptions = useMemo(() => (slice.state ? loadCities(slice.state) : []), [slice.state, loadCities]);
  const citySelectOptions = slice.city && !cityOptions.includes(slice.city)
    ? [...cityOptions, slice.city]
    : cityOptions;

  const stateKey = (): keyof LocationSlice =>
    (entityLabel ? `${entityLabel.toLowerCase()}State` : "state") as keyof LocationSlice;
  const cityKey = (): keyof LocationSlice =>
    (entityLabel ? `${entityLabel.toLowerCase()}City` : "city") as keyof LocationSlice;

  const isVerified = verifiedLocation != null;
  const pincodeError = (() => {
    if (!showPincode) return undefined;
    if (pincodeStatus === "notFound") return "This pincode could not be found — check and re-enter";
    if (pincodeStatus === "verifying") return undefined;
    if (pincodeStatus === "error") return "Could not verify pincode right now — it will be re-checked on submit";
    return errors[stateKey()];
  })();

  const handlePincodeChange = (raw: string) => {
    const next = raw.replace(/\D/g, "").replace(/^0+/, "").slice(0, 6);
    set("state" as keyof LocationSlice, "");
    set("city" as keyof LocationSlice, "");
    onPincodeResolved({ pincode: next, state: "", city: "" });
  };

  const stateValue = slice[stateKey()];
  const cityValue = slice[cityKey()];

  return (
    <>
      {showPincode && (
        <PincodeInputField
          id={`${entityLabel.toLowerCase()}Pincode`}
          label={`Current ${entityLabel} Pincode`}
          required
          value={slice["businessPincode" as keyof LocationSlice] ?? slice["pincode" as keyof LocationSlice] ?? ""}
          onChange={handlePincodeChange}
          err={pincodeError}
          disabled={false}
        />
      )}
      <Field
        id={stateKey()}
        label={`Current ${entityLabel} State`}
        required
        error={errors[stateKey()]}
      >
        {states.length > 0 ? (
          <SelectField
            value={stateValue}
            onChange={(v) => {
              set(stateKey(), v);
              set(cityKey(), "");
              loadCities(v);
            }}
            options={states}
            placeholder="Select"
            error={errors[stateKey()]}
          />
        ) : (
          <TextField
            value={stateValue}
            onChange={(v) => set(stateKey(), v)}
            placeholder="Your state"
            error={errors[stateKey()]}
          />
        )}
      </Field>
      <Field
        id={cityKey()}
        label={`Current ${entityLabel} City`}
        required
        error={errors[cityKey()]}
        hint={isVerified ? `Auto-filled from your pincode` : undefined}
      >
        {citySelectOptions.length > 0 ? (
          <SelectField
            value={cityValue}
            onChange={(v) => {
              set(cityKey(), v);
              setUserCity(v);
            }}
            options={citySelectOptions}
            placeholder={stateValue ? "Select city" : "Select state first"}
            error={errors[cityKey()]}
          />
        ) : (
          <TextField
            value={cityValue}
            onChange={(v) => {
              set(cityKey(), v);
              setUserCity(v);
            }}
            placeholder="Your city"
            error={errors[cityKey()]}
          />
        )}
      </Field>
    </>
  );
};

export default LocationFields;
