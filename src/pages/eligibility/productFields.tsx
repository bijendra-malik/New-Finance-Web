import type { EligibilityOutcome, ProductSpec } from "./models";
import type { FormState } from "./formState";
import TermFields from "./fields/termFields";
import AssetFields from "./fields/assetFields";
import EducationFields from "./fields/educationFields";
import BusinessFields from "./fields/businessFields";
import LrdFields from "./fields/lrdFields";

interface EligibilityProductFieldsProps {
  product: ProductSpec;
  form: FormState;
  errors: Record<string, string>;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  lrdLive: EligibilityOutcome | null;
  occupation: string;
  occupationOptions: readonly string[];
  incomeLabel: string;
  incomeHint: string;
  asset: ProductSpec["asset"];
  assetLtv: number;
}

const EligibilityProductFields = ({
  product,
  form,
  errors,
  set,
  lrdLive,
  occupation,
  occupationOptions,
  incomeLabel,
  incomeHint,
  asset,
  assetLtv,
}: EligibilityProductFieldsProps) => (
  <>
    <TermFields
      product={product}
      form={form}
      errors={errors}
      set={set}
      occupation={occupation}
      occupationOptions={occupationOptions}
      incomeLabel={incomeLabel}
      incomeHint={incomeHint}
      asset={asset}
      assetLtv={assetLtv}
    />
    <AssetFields product={product} form={form} errors={errors} set={set} />
    <EducationFields product={product} form={form} errors={errors} set={set} />
    <BusinessFields product={product} form={form} errors={errors} set={set} />
    <LrdFields product={product} form={form} errors={errors} set={set} lrdLive={lrdLive} />
  </>
);

export default EligibilityProductFields;
