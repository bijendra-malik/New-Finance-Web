import { useMemo } from "react";
import {
  DateOfBirthPicker, FieldError, FieldLabel, FormCard,
  PincodeInputField, SelectField, SelectWithOther, TextField,
} from "./FormControls";
import { OTHER_OPTION } from "../../constants/masters";
import { THEME as C } from "../../constants/theme";
import { FORM } from "../../constants/formStyles";
import { formatPAN } from "../../utils/formatters";

export type PersonalDetailsField =
  | "fullName" | "mobile" | "email" | "dob" | "panNumber"
  | "state" | "city" | "pincode" | "residenceStatus" | "residenceStatusOther";

interface PersonalDetailsSectionProps {
  /** Card title, e.g. "Personal Details" or "Personal Details (Student)". */
  title?: string;
  /** Card subtitle. */
  subtitle?: string;
  /** Full-name input placeholder. */
  fullNamePlaceholder?: string;
  /** Date-of-birth field label. */
  dobLabel?: string;
  /** PAN field label. */
  panLabel?: string;
  /** Whether the PAN field is required (default true). */
  panRequired?: boolean;
  form: Pick<Record<PersonalDetailsField, string>, PersonalDetailsField>;
  set: (key: PersonalDetailsField, value: string) => void;
  errors: Partial<Record<PersonalDetailsField, string>>;
  onPincodeResolved: (r: { pincode: string; state: string; city: string }) => void;
  /** Master state list from useMasters. */
  states: readonly string[];
  /** Residence-status master list from useMasters. */
  residenceStatuses: readonly string[];
  /** City loader from useMasters — populates the residence city dropdown. */
  loadCities: (state: string) => string[];
}

/**
 * Shared Personal Details card: name, mobile, email, DOB, PAN, residence
 * State/City/pincode (pincode-first auto-fill) and residence status.
 * Forms render one line instead of repeating the ~50-line block.
 */
export const PersonalDetailsSection = ({
  form, set, errors, onPincodeResolved, states, residenceStatuses, loadCities,
  title = "Personal Details", subtitle = "Basic details as per your official documents",
  fullNamePlaceholder = "As per Aadhaar / PAN", dobLabel = "Date of Birth (as per PAN card)",
  panLabel = "PAN Number", panRequired = true,
}: PersonalDetailsSectionProps) => {
  const residenceCityOptions = useMemo(
    () => loadCities(form.state),
    [form.state, loadCities]
  );

  return (
    <FormCard title={title} subtitle={subtitle}>
        <div className={FORM.grid}>
          <div id="fullName"><FieldLabel label="Full Name" required/>
            <TextField value={form.fullName} onChange={v=>set("fullName",v.slice(0,100))} maxLength={100} placeholder={fullNamePlaceholder} err={errors.fullName}/>
          </div>
          <div id="mobile"><FieldLabel label="Mobile Number" required/>
            <div className="flex items-center rounded-(--form-field-radius) overflow-hidden"
              style={{border:`1.5px solid ${errors.mobile?FORM.error:FORM.fieldBorder}`,background:FORM.fieldBg}}>
              <span className="px-3 py-2.5 text-sm font-semibold shrink-0 border-r" style={{color:C.dark,borderColor:FORM.fieldBorder}}>🇮🇳 +91</span>
              <input type="tel" value={form.mobile} maxLength={10} placeholder="10-digit number"
                onChange={e=>set("mobile",e.target.value.replace(/\D/g,""))}
                className="w-full px-3 py-2.5 text-sm bg-transparent focus:outline-none"/>
            </div><FieldError msg={errors.mobile}/>
          </div>
          <div id="email"><FieldLabel label="Email Address" required/>
            <TextField type="email" value={form.email} onChange={v=>set("email",v)} placeholder="your@email.com" err={errors.email}/>
          </div>
          <div id="dob"><FieldLabel label={dobLabel} required/>
            <DateOfBirthPicker value={form.dob} onChange={v=>set("dob",v)} err={errors.dob}/>
          </div>
          <div id="panNumber"><FieldLabel label={panLabel} required={panRequired}/>
            <TextField value={form.panNumber} onChange={v=>set("panNumber",formatPAN(v))} placeholder="Individual pan card no. - ABCDE1234F" maxLength={10} err={errors.panNumber} extraCls="uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"/>
          </div>
          <div id="state"><FieldLabel label="Current Residence State" required/>
            <SelectField value={form.state} onChange={v=>{
              set("state",v); set("city",""); loadCities(v);
            }} options={states} placeholder="Select" err={errors.state}/>
          </div>
          <div id="city"><FieldLabel label="Current Residence City" required/>
            <SelectField value={form.city} onChange={v=>set("city",v)}
              options={residenceCityOptions} placeholder={form.state?"Select city":"Select state first"} disabled={!form.state} err={errors.city}/>
          </div>
          <PincodeInputField
            id="pincode" label="Current Residence Pincode"
            value={form.pincode} onChange={v=>set("pincode",v)}
            onResolved={r=>onPincodeResolved(r)} err={errors.pincode}
          />
          <SelectWithOther
            id="residenceStatus" label="Status of Current Residence" required
            value={form.residenceStatus} onChange={v=>{
              set("residenceStatus",v);
              if(v!==OTHER_OPTION) set("residenceStatusOther","");
            }} options={residenceStatuses} err={errors.residenceStatus}
            otherId="residenceStatusOther" otherLabel="Mention Status of Residence"
            otherValue={form.residenceStatusOther} onOtherChange={v=>set("residenceStatusOther",v)}
            otherPlaceholder="Enter residence status type" otherErr={errors.residenceStatusOther}
          />
        </div>
    </FormCard>
  );
};
