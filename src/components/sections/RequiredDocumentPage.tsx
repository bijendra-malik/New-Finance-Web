import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApplicationModal from "../modals/ApplicationModal";

// ── Document data ─────────────────────────────────────────────────────────────
const documentSections = [
  {
    id: "identity",
    title: "Identity & KYC",
    docs: [
      { name: "Passport Size Photograph", note: "Recent, plain white background" },
      { name: "PAN Card", note: "Clear scan or high-quality photo" },
      { name: "Aadhaar Card", note: "Front & back copy" },
    ],
  },
  {
    id: "address",
    title: "Address Proof",
    docs: [
      { name: "Current Residence Proof", note: "Utility bill, rent agreement, or bank statement" },
      { name: "Permanent Address Proof", note: "Voter ID, passport, or Aadhaar" },
    ],
  },
  {
    id: "income",
    title: "Income & Financial",
    docs: [
      { name: "Latest 3 Months Salary Slip", note: "For salaried applicants" },
      { name: "Bank Statement (3–6 Months)", note: "Salaried account / salary-credited account" },
    ],
  },
  {
    id: "selfemployed",
    title: "Self-Employed (Additional)",
    docs: [
      { name: "Balance Sheet & P&L Account", note: "Last 2 financial years" },
      { name: "Partnership Deed / MOA / AOA", note: "For firms or companies" },
      { name: "Other Mandatory Business Documents", note: "GST returns, trade licence, etc." },
    ],
  },
];

// ── Process steps ─────────────────────────────────────────────────────────────
const steps = [
  { num: "01", title: "Gather Documents", desc: "Collect all the required documents listed below." },
  { num: "02", title: "Fill Application", desc: "Submit your details via our quick online form." },
  { num: "03", title: "Verification", desc: "Our team verifies your documents within 24 hrs." },
  { num: "04", title: "Loan Disbursal", desc: "Amount credited to your account after approval." },
];

// ── Component ─────────────────────────────────────────────────────────────────
const RequiredDocumentPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const loanName = searchParams.get("loan") || "Personal Loan";

  return (
    <>
      {/* ── BANNER ─────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full min-h-[320px] md:min-h-[380px] flex items-center overflow-hidden"
        // style={{
        //   backgroundImage: `url(${bannerBg})`,
        //   backgroundSize: "cover",
        //   backgroundPosition: "center top",
        // }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(14,30,60,0.92) 0%, rgba(27,108,168,0.78) 55%, rgba(30,144,255,0.55) 100%)",
          }}
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-6 py-4">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/55 mb-8">
            <button
              onClick={() => navigate("/")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>›</span>
            <span className="text-white/85 font-medium">{loanName}</span>
          </nav>

          {/* Split: left = text, right = tagline + button */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* LEFT */}
            <div className="flex-1 max-w-lg">
              <p className="text-white/50 text-xs md:text-lg leading-relaxed">
                The documentation process in personal loans is very fast as against secured loans.
                Keep these documents ready and get approved in minutes.
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-start lg:items-end gap-8 flex-shrink-0">
              <p
                className="text-lg md:text-xl font-semibold italic"
                style={{ color: "#ffffffff" }}
              >
                Now Right Banck will come at your doorstep
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-sm text-white cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #26ae90 0%,  #066a9c 100%)",
                  boxShadow: "0 4px 18px rgba(46,139,87,0.45)",
                }}
              >
                Apply Now
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────────── */}
      <div className="bg-white">

        {/* ── Document List ── */}
        <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Required Documents For {loanName}
          </h2>

          <div className="space-y-6">
            {documentSections.map((section) => (
              <div key={section.id}>
                <h3 className="text-base font-semibold text-gray-700 mb-1  border-b border-gray-200">
                  {section.title}
                </h3>
                <ul className="space-y-2.5 mt-2">
                  {section.docs.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-800 text-sm">{doc.name}</span>
                        {doc.note && (
                          <span className="text-gray-500 text-sm"> — {doc.note}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── How It Works ── */}
        <div className="w-full border-t border-gray-100 py-6 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 md:px-12">

            <div className="mb-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">How It Works</p>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                4 Simple Steps to Your Loan
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative p-5 rounded-xl border border-gray-200 bg-white"
                >
                  {/* Arrow connector */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  <span className="text-2xl font-black text-gray-200 leading-none block mb-2">
                    {step.num}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">{step.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={loanName}
      />
    </>
  );
};

export default RequiredDocumentPage;
