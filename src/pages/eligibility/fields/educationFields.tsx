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
            required
          />
          <AmountField
            id="elig-edu-hostel"
            label="Hostel and living costs"
            value={form.eduHostel}
            onChange={(next) => set("eduHostel", next)}
            placeholder="e.g. 1,50,000"
            hint="For the duration of the course"
          />
          <AmountField
            id="elig-edu-other"
            label="Other eligible expenses"
            value={form.eduOther}
            onChange={(next) => set("eduOther", next)}
            placeholder="e.g. 50,000"
            hint="Books, equipment, exam, travel"
          />
          <AmountField
            id="elig-edu-scholarship"
            label="Scholarships or grants"
            value={form.eduScholarship}
            onChange={(next) => set("eduScholarship", next)}
            placeholder="e.g. 25,000"
            hint="Leave blank if none"
          />
        </div>
        <AmountField
          id="elig-edu-margin"
          label="Margin money"
          value={form.eduMargin}
          onChange={(next) => set("eduMargin", next)}
          placeholder="e.g. 1,00,000"
          hint="Cost your family funds itself"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-edu-income"
            label="Co-applicant Income (guardian)"
            value={form.monthlyIncome}
            onChange={(next) => set("monthlyIncome", next)}
            placeholder="e.g. 80,000"
            hint="Guardian's Monthly Net Income"
          />
          <AmountField
            id="elig-edu-emi"
            label="Total monthly EMI"
            value={form.existingEmi}
            onChange={(next) => set("existingEmi", next)}
            error={errors.existingEmi}
            placeholder="e.g. 5,000"
            hint="Enter 0 if you have no EMI"
            required
          />
        </div>
      </div>
    )}

  </>
);

export default EducationFields;
