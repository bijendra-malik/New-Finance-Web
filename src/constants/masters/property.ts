// Property- and project-related master lists.
import { OTHER_OPTION } from "./common";

export const BUYING_PROPERTY_TYPES = [
  "New", "Under-construction", "Old-construction", OTHER_OPTION,
] as const;

export const COLLATERAL_PROPERTY_TYPES = [
  "Residential Property", "Commercial Property", "Industrial Property", OTHER_OPTION,
] as const;

export const OD_CC_LIMIT_AGAINST_TYPES = [
  "Residential Property", "Commercial Property", "Industrial Property", "Unsecured", OTHER_OPTION,
] as const;

export const FDI_FUND_AGAINST_TYPES = [
  "Company Valuation", "Residential Property", "Commercial Property", "Industrial Property", OTHER_OPTION,
] as const;

export const PROJECT_TYPES = [
  "Construction Project", "Infrastructure Development", "Real Estate Development",
  "Manufacturing / Industrial Project", "Expansion Project", "Renewable Energy Project",
  OTHER_OPTION,
] as const;

export const COMMERCIAL_PROPERTY_TYPES = [
  "Commercial", "Industrial", OTHER_OPTION,
] as const;
