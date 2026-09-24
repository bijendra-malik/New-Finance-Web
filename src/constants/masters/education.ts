// Education-loan-related master lists.
import { OTHER_OPTION } from "./common";

export const EDUCATION_COUNTRIES = [
  "India", "USA", "United Kingdom", "Canada", "Australia", "Germany", "Ireland",
  "Singapore", "New Zealand", OTHER_OPTION,
] as const;

export const FIELD_OF_STUDY = [
  "Engineering", "Medicine", "Management / MBA", "Computer Science / IT", "Law",
  "Arts & Humanities", "Science", "Commerce", OTHER_OPTION,
] as const;

export const ENROLLMENT_STATUSES = [
  "Admission Confirmed", "Admission Applied", "Yet to Apply", OTHER_OPTION,
] as const;

export const PARENT_RELATIONSHIPS = [
  "Father", "Mother", "Guardian", OTHER_OPTION,
] as const;
