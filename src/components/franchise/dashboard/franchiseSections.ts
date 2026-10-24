/** The dashboard's left-panel sections and how the URL maps onto them. */

import type { FranchiseIconName } from "../FranchiseIcon";

export type Section = "overview" | "customers" | "loans" | "apply" | "profile" | "plan";

export const SECTIONS: { id: Section; label: string; icon: FranchiseIconName; description: string }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: "scale",
    description: "Your franchise at a glance — customers, filings and agreement status.",
  },
  {
    id: "customers",
    label: "Customers",
    icon: "user",
    description: "Register clients once, then file any loan product for them.",
  },
  {
    id: "loans",
    label: "All Loans",
    icon: "layers",
    description: "Every application filed under your franchise ID, with its live status.",
  },
  {
    id: "apply",
    label: "Apply Loan",
    icon: "pen-line",
    description: "Pick a product and file it on behalf of a registered customer.",
  },
  {
    id: "profile",
    label: "My Details",
    icon: "handshake",
    description: "Your personal details and franchise account information.",
  },
  {
    id: "plan",
    label: "My Plan",
    icon: "plans",
    description: "Your current plan, the time left on it, and every published plan.",
  },
];

export const resolveSection = (raw: string | null): Section => {
  if (
    raw === "customers" ||
    raw === "loans" ||
    raw === "apply" ||
    raw === "overview" ||
    raw === "profile" ||
    raw === "plan"
  ) {
    return raw;
  }
  if (raw === "products") return "apply";
  if (raw === "plans") return "plan";
  if (raw === "details") return "profile";
  return "overview";
};
