import {
  AmountField, FieldLabel, FormCard, OtherOptionList, PillMultiSelect,
} from "./FormControls";
import { OTHER_OPTION } from "../../constants/masters";
import { THEME as C } from "../../constants/theme";

export interface ExistingLoanExposureSlice {
  existingEMI: string;
  existingLoanAmount: string;
  existingBanks: string[];
  existingBanksOther: string[];
  existingLoanTypes: string[];
  existingLoanTypesOther: string[];
}

interface ExistingLoanExposureSectionProps {
  form: ExistingLoanExposureSectionPropsSlice;
  set: (key: "existingEMI" | "existingLoanAmount", value: string) => void;
  errors: Partial<Record<"existingEMI" | "existingLoanAmount", string>>;
  mergeForm: (patch: Partial<ExistingLoanExposureSlice>) => void;
  banks: readonly string[];
  existingLoanTypes: readonly string[];
  emiLabel?: string;
}

type ExistingLoanExposureSectionPropsSlice = ExistingLoanExposureSlice;

export const ExistingLoanExposureSection = ({
  form, set, errors, mergeForm, banks, existingLoanTypes,
  emiLabel = "Existing Total EMI",
}: ExistingLoanExposureSectionProps) => {
  const hasExposure = parseInt(form.existingEMI) > 0 || parseInt(form.existingLoanAmount) > 0;

  return (
    <FormCard title="Existing Loan Exposure" subtitle="Fill 0 if you have no existing loans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div id="existingEMI"><FieldLabel label={emiLabel} required/>
          <AmountField value={form.existingEMI} onChange={v=>set("existingEMI",v.replace(/\D/g,""))} placeholder="Enter Amount in INR" err={errors.existingEMI}/>
        </div>
        <div id="existingLoanAmount"><FieldLabel label="Existing Loan Amount (Total)" required/>
          <AmountField value={form.existingLoanAmount} onChange={v=>set("existingLoanAmount",v.replace(/\D/g,""))} placeholder="Enter Amount in INR" err={errors.existingLoanAmount}/>
        </div>
      </div>

      <div className="mb-5">
        <FieldLabel label="Existing Loan Bank's Name"/>
        {!hasExposure&&<p className="text-xs mb-2" style={{color:C.gray}}>Enter Existing Total EMI or Existing Loan Amount above to enable selection</p>}
        <PillMultiSelect options={banks} selected={form.existingBanks} disabled={!hasExposure}
          onChange={vals=>mergeForm({existingBanks:vals, existingBanksOther:vals.includes(OTHER_OPTION)?form.existingBanksOther:[]})}
          color={C.teal}/>

        {hasExposure&&form.existingBanks.includes(OTHER_OPTION)&&(
          <OtherOptionList label="Other Existing Loan Bank Name" placeholder="Enter other bank name"
            items={form.existingBanksOther} onAdd={value=>mergeForm({existingBanksOther:[...form.existingBanksOther, value]})}
            onRemove={idx=>mergeForm({existingBanksOther:form.existingBanksOther.filter((_,i)=>i!==idx)})} color={C.teal} existingOptions={banks}/>
        )}
      </div>

      <div>
        <FieldLabel label="Existing Loan Types"/>
        {!hasExposure&&<p className="text-xs mb-2" style={{color:C.gray}}>Enter Existing Total EMI or Existing Loan Amount above to enable selection</p>}
        <PillMultiSelect options={existingLoanTypes} selected={form.existingLoanTypes} disabled={!hasExposure}
          onChange={vals=>mergeForm({existingLoanTypes:vals, existingLoanTypesOther:vals.includes(OTHER_OPTION)?form.existingLoanTypesOther:[]})}
          color={C.navy}/>

        {hasExposure&&form.existingLoanTypes.includes(OTHER_OPTION)&&(
          <OtherOptionList label="Other Existing Loan Types" placeholder="Enter other loan type"
            items={form.existingLoanTypesOther} onAdd={value=>mergeForm({existingLoanTypesOther:[...form.existingLoanTypesOther, value]})}
            onRemove={idx=>mergeForm({existingLoanTypesOther:form.existingLoanTypesOther.filter((_,i)=>i!==idx)})} color={C.navy} existingOptions={existingLoanTypes}/>
        )}
      </div>
    </FormCard>
  );
};
