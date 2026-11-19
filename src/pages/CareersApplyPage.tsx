import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import useSEO from "../hooks/useSEO";
import {
  ABOUT_MAX_LENGTH,
  CAREER_ROLES,
  EXPERIENCE_LEVELS,
  OPEN_APPLICATION,
  RESUME_EXTENSIONS,
  RESUME_MAX_BYTES,
} from "../constants/careers";
import { submitCareerApplication } from "../api/careers";
import { EMAIL_CAREERS, PHONE_LANDLINE, PHONE_LANDLINE_HREF } from "../constants/contact";
import { EMAIL_REGEX } from "../utils/validation";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  role: string;
  about: string;
}

const MAX_RESUME_MB = Math.round(RESUME_MAX_BYTES / (1024 * 1024));

const readAsBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? "").split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("That file could not be read. Please try another."));
    reader.readAsDataURL(file);
  });

const inputCls = (invalid: boolean) =>
  `w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 bg-white transition-all focus:outline-none focus:ring-2 focus:ring-(--brand-teal-20) focus:border-(--brand-teal) ${
    invalid ? "border-red-400" : "border-slate-200 hover:border-slate-300"
  }`;

const labelCls = "block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5";

const CareersApplyPage = () => {
  const [searchParams] = useSearchParams();
  const roleParam = (searchParams.get("role") ?? "").trim();
  const deptParam = (searchParams.get("dept") ?? "").trim();

  const role = useMemo(
    () => CAREER_ROLES.find((item) => item.title === roleParam) ?? null,
    [roleParam],
  );

  useSEO({
    title: roleParam ? `Apply for ${roleParam} — Indexia Finance Careers` : "Apply — Indexia Finance Careers",
    description:
      "Apply to Indexia Finance. Share your details, attach your resume and our HR team will get back to you.",
    path: "/careers/apply",
  });

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    role: roleParam || "",
    about: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "resume", string>>>({});
  const [resume, setResume] = useState<{ name: string; data: string } | null>(null);
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const positionOptions = useMemo(
    () => [...CAREER_ROLES.map((item) => item.title), OPEN_APPLICATION],
    [],
  );

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
    if (!RESUME_EXTENSIONS.includes(extension as (typeof RESUME_EXTENSIONS)[number])) {
      setResume(null);
      setErrors((prev) => ({ ...prev, resume: "Attach a PDF, DOC or DOCX file" }));
      return;
    }
    if (file.size > RESUME_MAX_BYTES) {
      setResume(null);
      setErrors((prev) => ({ ...prev, resume: `That file is ${MAX_RESUME_MB} MB+ — please attach a smaller resume` }));
      return;
    }
    try {
      const data = await readAsBase64(file);
      setResume({ name: file.name, data });
      setErrors((prev) => ({ ...prev, resume: "" }));
    } catch (error) {
      setResume(null);
      setErrors((prev) => ({ ...prev, resume: error instanceof Error ? error.message : "Could not read that file" }));
    }
  };

  const removeFile = () => {
    setResume(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState | "resume", string>> = {};
    if (form.fullName.trim().length < 2) next.fullName = "Enter your full name";
    if (!EMAIL_REGEX.test(form.email.trim())) next.email = "Enter a valid email address";
    if (form.phone.replace(/\D/g, "").length !== 10) next.phone = "Enter a valid 10-digit phone number";
    if (!form.experience) next.experience = "Choose your experience level";
    if (!form.role) next.role = "Choose the role you are applying for";
    if (!form.about.trim()) next.about = "Tell us a little about yourself";
    else if (form.about.length > ABOUT_MAX_LENGTH) next.about = `Keep this within ${ABOUT_MAX_LENGTH} characters`;
    if (!resume) next.resume = "Attach your resume";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    if (!validate() || !resume) return;

    const department =
      CAREER_ROLES.find((item) => item.title === form.role)?.team ?? deptParam;

    setSubmitting(true);
    setApiError("");
    try {
      const response = await submitCareerApplication({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.replace(/\D/g, ""),
        experience: form.experience,
        role: form.role,
        department,
        about: form.about.trim(),
        resume,
      });
      if (!response.success) {
        setApiError(response.message || "We could not send your application. Please try again.");
        return;
      }
      setSent(true);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "We could not send your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageBanner
        breadcrumb="Careers / Apply"
        title={roleParam ? "Apply for" : "Apply with"}
        highlight={roleParam || "us"}
        tagline={role?.team ?? deptParam ?? "Send your resume and we will be in touch"}
      />

      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-12 md:px-8 md:py-14">
          <Link
            to="/careers"
            className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-navy) transition-colors hover:text-(--brand-teal)"
          >
            ← Back to careers
          </Link>

          {sent ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-6 py-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500">
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-emerald-900">Application sent</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-emerald-800">
                Thank you, {form.fullName.split(" ")[0] || "candidate"}. Your application for{" "}
                <strong>{form.role}</strong> is with our HR team at {EMAIL_CAREERS}. We will get back to you
                on {form.email} if your profile matches.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/careers"
                  className="rounded-full border border-(--brand-navy) px-6 py-2.5 text-sm font-bold text-(--brand-navy) transition hover:bg-(--brand-navy) hover:text-white"
                >
                  View all roles
                </Link>
                <Link
                  to="/"
                  className="rounded-full px-6 py-2.5 text-sm font-bold transition hover:opacity-90"
                  style={{ background: "var(--brand-yellow)", color: "var(--brand-navy)" }}
                >
                  Back to home
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Role context */}
              {role && (
                <section className="mb-6 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5">
                  <h2 className="text-lg font-bold text-slate-900">{role.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{role.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[role.team, role.location, role.type].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(6,106,156,0.06)] md:p-8">
                <header className="mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-extrabold text-slate-900">Your application</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Fill the form and we will send your application straight to our HR team. Fields marked
                    * are required.
                  </p>
                </header>

                {apiError && (
                  <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    <span aria-hidden="true" className="shrink-0">⚠️</span>
                    <span>{apiError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="career-name" className={labelCls}>Full Name *</label>
                      <input
                        id="career-name"
                        type="text"
                        autoComplete="name"
                        value={form.fullName}
                        onChange={(e) => set("fullName", e.target.value)}
                        placeholder="Your full name"
                        className={inputCls(Boolean(errors.fullName))}
                      />
                      {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label htmlFor="career-email" className={labelCls}>Email *</label>
                      <input
                        id="career-email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="you@example.com"
                        className={inputCls(Boolean(errors.email))}
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="career-phone" className={labelCls}>Phone *</label>
                      <input
                        id="career-phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
                        placeholder="10-digit mobile number"
                        className={inputCls(Boolean(errors.phone))}
                      />
                      {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                    </div>
                    <div>
                      <label htmlFor="career-experience" className={labelCls}>Experience *</label>
                      <select
                        id="career-experience"
                        value={form.experience}
                        onChange={(e) => set("experience", e.target.value)}
                        className={inputCls(Boolean(errors.experience))}
                      >
                        <option value="">Select experience</option>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                      {errors.experience && <p className="mt-1 text-xs text-red-500">{errors.experience}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="career-role" className={labelCls}>Position *</label>
                    <select
                      id="career-role"
                      value={form.role}
                      onChange={(e) => set("role", e.target.value)}
                      className={inputCls(Boolean(errors.role))}
                    >
                      <option value="">Select the role you are applying for</option>
                      {positionOptions.map((title) => (
                        <option key={title} value={title}>{title}</option>
                      ))}
                    </select>
                    {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
                  </div>

                  {/* Resume */}
                  <div>
                    <span className={labelCls}>Resume *</span>
                    <input
                      ref={fileRef}
                      id="career-resume"
                      type="file"
                      accept={RESUME_EXTENSIONS.join(",")}
                      className="sr-only"
                      onChange={(e) => { void handleFile(e.target.files?.[0]); }}
                    />
                    {resume ? (
                      <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">{resume.name}</p>
                          <p className="text-xs text-slate-500">Attached</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <label
                            htmlFor="career-resume"
                            className="cursor-pointer text-xs font-bold text-(--brand-navy) underline underline-offset-4"
                          >
                            Change
                          </label>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="cursor-pointer text-xs font-bold text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="career-resume"
                        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-4 py-6 text-center transition-colors hover:border-(--brand-teal) hover:bg-(--brand-teal-14) ${
                          errors.resume ? "border-red-400" : "border-slate-300"
                        }`}
                      >
                        <svg className="h-6 w-6 text-(--brand-navy)" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-sm font-semibold text-slate-700">Click to upload resume</span>
                        <span className="text-[11px] text-slate-500">PDF, DOC or DOCX (max {MAX_RESUME_MB} MB)</span>
                      </label>
                    )}
                    {errors.resume && <p className="mt-1 text-xs text-red-500">{errors.resume}</p>}
                  </div>

                  {/* About */}
                  <div>
                    <label htmlFor="career-about" className={labelCls}>Tell us about yourself *</label>
                    <textarea
                      id="career-about"
                      rows={4}
                      maxLength={ABOUT_MAX_LENGTH}
                      value={form.about}
                      onChange={(e) => set("about", e.target.value.slice(0, ABOUT_MAX_LENGTH))}
                      placeholder="Why are you a great fit for this role?"
                      className={`${inputCls(Boolean(errors.about))} resize-y`}
                      aria-describedby="career-about-count"
                    />
                    <div className="mt-1 flex items-center justify-between gap-3">
                      {errors.about
                        ? <p className="text-xs text-red-500">{errors.about}</p>
                        : <span />}
                      <span
                        id="career-about-count"
                        className={`text-[11px] tabular-nums ${
                          form.about.length >= ABOUT_MAX_LENGTH ? "font-bold text-amber-600" : "text-slate-400"
                        }`}
                      >
                        {form.about.length}/{ABOUT_MAX_LENGTH}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      style={{ background: "linear-gradient(135deg, var(--brand-navy), var(--brand-teal))", minWidth: 220 }}
                    >
                      {submitting ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </button>
                    <p className="text-center text-[11px] text-slate-500">
                      Your application will be sent to{" "}
                      <a href={`mailto:${EMAIL_CAREERS}`} className="font-semibold text-(--brand-navy) underline underline-offset-2">
                        {EMAIL_CAREERS}
                      </a>
                      . You can also call{" "}
                      <a href={PHONE_LANDLINE_HREF} className="font-semibold text-(--brand-navy) underline underline-offset-2">
                        {PHONE_LANDLINE}
                      </a>
                      .
                    </p>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CareersApplyPage;
