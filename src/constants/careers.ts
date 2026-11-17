/** Careers catalogue — used by the careers page and the apply form. */

export interface CareerRole {
  title: string;
  team: string;
  location: string;
  type: string;
  summary: string;
}

export const CAREER_ROLES: CareerRole[] = [
  {
    title: "Relationship Manager — Loans",
    team: "Sales & Distribution",
    location: "New Delhi",
    type: "Full-time",
    summary: "Own a portfolio of loan enquiries from first call to disbursal, working with our partner banks and NBFCs.",
  },
  {
    title: "Credit Analyst",
    team: "Credit & Risk",
    location: "New Delhi",
    type: "Full-time",
    summary: "Read income profiles and bureau reports, and put a defensible view on every file that reaches the lender.",
  },
  {
    title: "Frontend Engineer (React)",
    team: "Technology",
    location: "New Delhi / Remote",
    type: "Full-time",
    summary: "Build the application journeys customers actually use — forms, dashboards and calculators that stay fast and accessible.",
  },
  {
    title: "Backend Engineer (Node.js)",
    team: "Technology",
    location: "New Delhi / Remote",
    type: "Full-time",
    summary: "Design APIs and integrations for onboarding, KYC, bureau pulls and lender hand-offs.",
  },
  {
    title: "Operations Associate — Disbursals",
    team: "Operations",
    location: "New Delhi",
    type: "Full-time",
    summary: "Keep files moving between sanction and disbursal, and make sure nothing waits on us.",
  },
  {
    title: "Digital Marketing Specialist",
    team: "Growth",
    location: "New Delhi",
    type: "Full-time",
    summary: "Run performance and content campaigns for loan products across search, social and partner channels.",
  },
];

export const OPEN_APPLICATION = "Open application";

export const EXPERIENCE_LEVELS = [
  "Fresher",
  "Less than 1 year",
  "1-2 years",
  "2-5 years",
  "5+ years",
] as const;

/** "Tell us about yourself" is capped at 200 characters. */
export const ABOUT_MAX_LENGTH = 200;

/** Uploads are capped at 3 MB so the base64 request stays under the server limit. */
export const RESUME_MAX_BYTES = 3 * 1024 * 1024;
export const RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;
