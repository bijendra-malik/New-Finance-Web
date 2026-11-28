import type { FranchiseIconName } from "../FranchiseIcon";

export type Section = "overview" | "customers" | "loans" | "notifications" | "apply" | "profile" | "plan";

export const SECTIONS: { id: Section; label: string; icon: FranchiseIconName; description: string }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: "scale",
    description: "Your Franchise At A Glance — Customers, Filings And Agreement Status.",
  },
  {
    id: "customers",
    label: "Customers",
    icon: "user",
    description: "Register Clients Once, Then File Any Loan Product For Them.",
  },
  {
    id: "loans",
    label: "All Loans",
    icon: "layers",
    description: "Every Application Filed Under Your Franchise ID, With Its Live Status.",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: "bell",
    description: "Every Customer Registration And Loan Status Change Under Your Franchise.",
  },
  {
    id: "apply",
    label: "Apply Loan",
    icon: "pen-line",
    description: "Pick A Product And File It On Behalf Of A Registered Customer.",
  },
  {
    id: "profile",
    label: "My Details",
    icon: "handshake",
    description: "Your Personal Details And Franchise Account Information.",
  },
  {
    id: "plan",
    label: "My Plan",
    icon: "plans",
    description: "Your Current Plan, The Time Left On It, And Every Published Plan.",
  },
];

export const resolveSection = (raw: string | null): Section => {
  if (
    raw === "customers" ||
    raw === "loans" ||
    raw === "notifications" ||
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
