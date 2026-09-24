// Residence-related master lists.
import { OTHER_OPTION } from "./common";

export const RESIDENCE_STATUSES = [
  "Owned by self", "Owned by spouse", "Owned by parents", "Rented with siblings",
  "Rented with family", "Rent and stay alone", "Paying Guest", "Hostel",
  "Company Provided", OTHER_OPTION,
] as const;
