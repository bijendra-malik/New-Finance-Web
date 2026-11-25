import type { FormState } from "../formState";
import { type ProductSpec } from "../models";
import { AmountField } from "../fieldControls";

interface Props {
  product: ProductSpec;
  form: FormState;
  errors: Record<string, string>;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

const EducationFields = ({ product, form, errors, set }: Props) => (
  <>
    {product.family === "education" && (
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-edu-fees"
            label="Course fees"
            value={form.eduFees}
            onChange={(next) => set("eduFees", next)}
            error={errors.eduFees}
            placeholder="e.g. 8,00,000"
            hint="Tuition for the full programme"
          />
          <AmountField
            id="elig-edu-hostel"
            label="Hostel and living costs"
            value={form.eduHostel}
            onChange={(next) => set("eduHostel", next)}
            hint="For the duration of the course"
          />
          <AmountField
            id="elig-edu-other"
            label="Other eligible expenses"
            value={form.eduOther}
            onChange={(next) => set("eduOther", next)}
            hint="Books, equipment, exam and travel costs"
          />
          <AmountField
            id="elig-edu-scholarship"
            label="Scholarships or grants"
            value={form.eduScholarship}
            onChange={(next) => set("eduScholarship", next)}
            hint="Leave blank if none"
          />
        </div>
        <AmountField
          id="elig-edu-margin"
          label="Margin money"
          value={form.eduMargin}
          onChange={(next) => set("eduMargin", next)}
          hint="The part of the cost your family funds itself"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-edu-income"
            label="Co-applicant monthly income"
            value={form.monthlyIncome}
            onChange={(next) => set("monthlyIncome", next)}
            hint="Counted towards the repayment capacity"
          />
          <AmountField
            id="elig-edu-emi"
            label="EMIs already paid"
            value={form.existingEmi}
            onChange={(next) => set("existingEmi", next)}
            hint="Leave blank if none"
          />
        </div>
      </div>
    )}

  </>
);

export default EducationFields;
