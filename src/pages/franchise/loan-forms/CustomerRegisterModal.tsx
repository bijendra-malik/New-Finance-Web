import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import {
  DateOfBirthPicker,
  FieldLabel,
  SelectField,
  TextField,
} from "../../../components/form/FormControls";
import { useMasters } from "../../../hooks/useMasters";
import {
  EMAIL_REGEX,
  MOBILE_REGEX,
  NAME_REGEX,
  PAN_REGEX,
  PINCODE_REGEX,
} from "../../../utils/validation";
import { formatPAN } from "../../../utils/formatters";
import {
  franchisePortalError,
  registerFranchiseCustomer,
  type FranchiseCustomer,
} from "../../../api/franchiseCustomers";

interface CustomerRegisterModalProps {
  open: boolean;
  onClose: () => void;
  /** Called after the backend accepts the registration. */
  onRegistered: (customer: FranchiseCustomer | null) => void;
}

type FormState = {
  fullName: string;
  mobile: string;
  panNumber: string;
  dob: string;
  email: string;
  state: string;
  city: string;
  pincode: string;
};

const EMPTY: FormState = {
  fullName: "",
  mobile: "",
  panNumber: "",
  dob: "",
  email: "",
  state: "",
  city: "",
  pincode: "",
};

/**
 * Register a new client for the franchise — the eight fields
 * POST /franchise/customer/register requires, validated the same way the
 * customer portal validates them.
 */
const CustomerRegisterModal = ({ open, onClose, onRegistered }: CustomerRegisterModalProps) => {
  const { masters, loadCities } = useMasters();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const cityOptions = loadCities(form.state);

  const set = (key: keyof FormState, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    else if (!NAME_REGEX.test(form.fullName.trim()))
      e.fullName = "Name must be at least 2 characters and contain only letters, spaces, dots or hyphens";
    if (!form.mobile.trim()) e.mobile = "Mobile number is required";
    else if (!MOBILE_REGEX.test(form.mobile.replace(/\D/g, "")))
      e.mobile = "Enter a valid 10-digit mobile number";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!EMAIL_REGEX.test(form.email.trim())) e.email = "Enter a valid email address";
    if (!form.dob) e.dob = "Date of birth is required";
    else {
      const dobDate = new Date(`${form.dob}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dobDate > today) e.dob = "Date of birth cannot be in the future";
      else {
        const minAgeDate = new Date(today.getFullYear() - 21, today.getMonth(), today.getDate());
        if (dobDate < minAgeDate) e.dob = "Customer must be at least 21 years old";
      }
    }
    if (!form.panNumber.trim()) e.panNumber = "PAN is required";
    else if (!PAN_REGEX.test(form.panNumber.trim().toUpperCase()))
      e.panNumber = "Invalid PAN format. Example: ABCDE1234F";
    if (!form.state) e.state = "State is required";
    if (!form.city) e.city = "City is required";
    if (!form.pincode.trim()) e.pincode = "Pincode is required";
    else if (!PINCODE_REGEX.test(form.pincode.trim())) e.pincode = "Enter a valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.SyntheticEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setBusy(true);
    try {
      const res = await registerFranchiseCustomer({
        fullName: form.fullName.trim(),
        mobile: form.mobile.replace(/\D/g, "").slice(-10),
        panNumber: form.panNumber.trim().toUpperCase(),
        dob: form.dob,
        email: form.email.trim().toLowerCase(),
        state: form.state,
        city: form.city,
        pincode: form.pincode.trim(),
      });
      if (!res.ok) {
        setFormError(res.message);
        return;
      }
      setForm(EMPTY);
      onRegistered(res.customer);
    } catch (err) {
      setFormError(franchisePortalError(err, "Could not register the customer."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="customer-register-title" maxWidth="max-w-2xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 pt-6 pb-3">
        <div>
          <h2 id="customer-register-title" className="text-lg font-extrabold text-slate-800">
            Register a new customer
          </h2>
          <p className="mt-0.5 text-[12.5px] text-slate-500">
            These details are stored under your franchise ID and used for every loan you file for this customer.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={submit} noValidate className="overflow-y-auto px-6 py-5" style={{ maxHeight: "calc(92vh - 8rem)" }}>
        {formError && (
          <p
            role="alert"
            className="mb-4 rounded-xl px-4 py-3 text-[12.5px] font-semibold"
            style={{
              background: "var(--form-error-bg, #fef2f2)",
              border: "1px solid var(--form-error-border, #fecaca)",
              color: "var(--form-error-text, #b91c1c)",
            }}
          >
            {formError}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel label="Full name" required />
            <TextField value={form.fullName} onChange={(v) => set("fullName", v.slice(0, 100))} maxLength={100} placeholder="As per PAN card" err={errors.fullName} />
          </div>
          <div>
            <FieldLabel label="Mobile" required />
            <TextField value={form.mobile} onChange={(v) => set("mobile", v.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile" err={errors.mobile} inputMode="tel" />
          </div>
          <div>
            <FieldLabel label="Email address" required />
            <TextField type="email" value={form.email} onChange={(v) => set("email", v)} placeholder="customer@example.com" err={errors.email} />
          </div>
          <div>
            <FieldLabel label="PAN number" required />
            <TextField value={form.panNumber} onChange={(v) => set("panNumber", formatPAN(v))} maxLength={10} placeholder="ABCDE1234F" err={errors.panNumber} extraCls="uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal" />
          </div>
          <div>
            <FieldLabel label="Date of birth" required />
            <DateOfBirthPicker value={form.dob} onChange={(v) => set("dob", v)} err={errors.dob} />
          </div>
          <div>
            <FieldLabel label="Pincode" required />
            <TextField
              value={form.pincode}
              onChange={(v) => set("pincode", v.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit pincode"
              err={errors.pincode}
              inputMode="numeric"
            />
          </div>
          <div>
            <FieldLabel label="State" required />
            <SelectField value={form.state} onChange={(v) => { set("state", v); set("city", ""); }} options={masters.states} placeholder="Select state" err={errors.state} />
          </div>
          <div>
            <FieldLabel label="City" required />
            <SelectField
              value={form.city}
              onChange={(v) => set("city", v)}
              options={cityOptions}
              placeholder={form.state ? "Select city" : "Select state first"}
              err={errors.city}
              disabled={!form.state}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" size="md" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" size="md" loading={busy}>
            Register customer
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerRegisterModal;
