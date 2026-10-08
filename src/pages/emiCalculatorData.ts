/** EMI calculator design tokens, loan-type config and formatting helpers. */

export const T = {
  navy: "var(--brand-navy)",       // deep blue — primary dark, headers, hero
  navyDeep: "#032B5C",   // darker blue for gradients/depth
  gold: "var(--brand-yellow)",       // lime — CTA, high-energy accents
  goldSoft: "#E7F98F",   // soft lime for text-on-dark / highlights
  cream: "#F1FAF8",      // teal-tinted off-white background
  paper: "#FFFFFF",
  ink: "#0C2A4D",
  inkSoft: "var(--brand-gray)",    // grey — secondary text
  emerald: "var(--brand-teal)",    // bisleri green — principal, primary active color
  emeraldSoft: "#D7F5F1",
  rust: "#2E6FB5",       // mid-blue — interest, secondary data color
  rustSoft: "#DEEAF8",
  limeDark: "#8FA916",   // accessible lime for text/borders on light bg
  limeSoft: "#F2FAD1",
  line: "#E2E8E7",
};

export const serif = { fontFamily: "'Fraunces', Georgia, serif" };

// ── Loan type config ──────────────────────────────────────────────────────────
export const loanTypes = [
  { id: "personal",  label: "Personal",   full: "Personal Loan",        rate: 11.0, minAmt: 50000,   maxAmt: 5000000,  minTenure: 1, maxTenure: 5  },
  { id: "home",      label: "Home",       full: "Home Loan",            rate: 8.5,  minAmt: 500000,  maxAmt: 50000000, minTenure: 5, maxTenure: 30 },
  { id: "car", label: "Vehicle", full: "Vehicle Loan",             rate: 9.0,  minAmt: 100000,  maxAmt: 5000000,  minTenure: 1, maxTenure: 7  },
  { id: "business",  label: "Business",   full: "Business Loan",        rate: 12.0, minAmt: 100000,  maxAmt: 10000000, minTenure: 1, maxTenure: 5  },
  { id: "education", label: "Education",  full: "Education Loan",       rate: 8.0,  minAmt: 100000,  maxAmt: 2000000,  minTenure: 1, maxTenure: 7  },
  { id: "lap",       label: "Property",   full: "Loan Against Property",rate: 9.5,  minAmt: 500000,  maxAmt: 50000000, minTenure: 5, maxTenure: 20 },
  { id: "balance",   label: "Transfer",   full: "Balance Transfer",     rate: 9.0,  minAmt: 100000,  maxAmt: 5000000,  minTenure: 1, maxTenure: 5  },
  { id: "credit",    label: "Credit Card",full: "Credit Card",          rate: 18.0, minAmt: 10000,   maxAmt: 500000,   minTenure: 1, maxTenure: 3  },
];

export const banks = [
  { id: "hdfc",   label: "HDFC Bank" },
  { id: "icici",  label: "ICICI Bank" },
  { id: "axis",   label: "Axis Bank" },
  { id: "kotak",  label: "Kotak Mahindra Bank" },
  { id: "sbi",    label: "State Bank of India" },
  { id: "pnb",    label: "PNB Housing" },
  { id: "bajaj",  label: "Bajaj Finserv" },
  { id: "tata",   label: "Tata Capital" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export const fmt = (n: number) => "\u20B9" + Math.round(n).toLocaleString("en-IN");
