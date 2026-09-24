// Gold-loan-specific master lists.
import { OTHER_OPTION } from "./common";

export const GOLD_LOAN_TYPES = [
  "Jewellery", "Coin", "Bar", OTHER_OPTION,
] as const;

export const GOLD_CARATS_JEWELRY = [
  "18 Karat", "20 Karat", "22 Karat", OTHER_OPTION,
] as const;

export const GOLD_CARATS_NON_JEWELRY = [
  "18 Karat", "22 Karat", "24 Karat", OTHER_OPTION,
] as const;
