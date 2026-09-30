// Vehicle-related master lists.
import { OTHER_OPTION } from "./common";

export const VEHICLE_TYPES = [
  "Four Wheeler", "Two Wheeler", "Commercial Vehicle",
  OTHER_OPTION,
] as const;

export const TRANSMISSION_TYPES = [
  "Manual", "Automatic", OTHER_OPTION,
] as const;

export const VEHICLE_PURCHASE_TYPES = [
  "New Vehicle", "Used Vehicle", OTHER_OPTION,
] as const;
