import { useMemo } from "react";
import { FieldLabel, PincodeInputField, SelectField, SelectWithOther } from "./FormControls";
import { OTHER_OPTION } from "../../constants/masters";

export interface BusinessPlaceSlice {
  businessState: string;
  businessCity: string;
  businessPincode: string;
  businessPlaceStatus: string;
  businessPlaceStatusOther: string;
}

interface BusinessPlaceSectionProps {
  form: BusinessPlaceSlice;
  set: (key: keyof BusinessPlaceSlice, value: string) => void;
  errors: Partial<Record<keyof BusinessPlaceSlice, string>>;
  onPincodeResolved: (r: { pincode: string; state: string; city: string }) => void;
  states: readonly string[];
  businessPlaceStatuses: readonly string[];
  loadCities: (state: string) => string[];
  entityLabel?: string;
}

export const BusinessPlaceSection = ({
  form, set, errors, onPincodeResolved, states, businessPlaceStatuses, loadCities,
  entityLabel = "Business",
}: BusinessPlaceSectionProps) => {
  const businessCityOptions = useMemo(
    () => loadCities(form.businessState),
    [form.businessState, loadCities]
  );

  return (
    <>
      <div id="businessState"><FieldLabel label={`Current ${entityLabel} State`} required/>
        <SelectField value={form.businessState} onChange={v=>{
          set("businessState",v); set("businessCity",""); loadCities(v);
        }} options={states} placeholder="Select" err={errors.businessState}/>
      </div>
      <div id="businessCity"><FieldLabel label={`Current ${entityLabel} City`} required/>
        <SelectField value={form.businessCity} onChange={v=>set("businessCity",v)}
          options={businessCityOptions} placeholder={form.businessState?"Select city":"Select state first"} disabled={!form.businessState} err={errors.businessCity}/>
      </div>
      <PincodeInputField
        id="businessPincode" label={`Current ${entityLabel} Pincode`}
        value={form.businessPincode} onChange={v=>set("businessPincode",v)}
        onResolved={r=>onPincodeResolved(r)} err={errors.businessPincode}
      />
      <SelectWithOther
        id="businessPlaceStatus" label={`Status Of ${entityLabel} Place`} required
        value={form.businessPlaceStatus} onChange={v=>{
          set("businessPlaceStatus",v);
          if(v!==OTHER_OPTION) set("businessPlaceStatusOther","");
        }} options={businessPlaceStatuses} err={errors.businessPlaceStatus}
        otherId="businessPlaceStatusOther" otherLabel={`Mention Status Of ${entityLabel} Place`}
        otherValue={form.businessPlaceStatusOther} onOtherChange={v=>set("businessPlaceStatusOther",v)}
        otherPlaceholder={`Enter status of ${entityLabel.toLowerCase()} place`} otherErr={errors.businessPlaceStatusOther}
      />
    </>
  );
};
