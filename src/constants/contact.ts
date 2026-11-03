export const COMPANY_LEGAL_NAME =
  "Indexia Finserve Pvt. Ltd. (Indexia Finance) — an Indexia Group company";

export const OFFICE_DISPLAY_NAME =
  "Indexia Finserve Pvt. Ltd. - An Indexia Group Company";

export const OFFICE_ADDRESS_LINES = [
  "213, Second Floor, Imperial Tower",
  "Near Gurudwara, C Block Commercial Complex",
  "Naraina Vihar, New Delhi – 110028",
] as const;

export const OFFICE_ADDRESS = OFFICE_ADDRESS_LINES.join(", ");

export const OFFICE_MAP_QUERY =
  "Indexia Finserve Pvt. Ltd., 213, Imperial Tower, C Block Commercial Complex, Naraina Vihar, New Delhi 110028";

export const OFFICE_MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(OFFICE_MAP_QUERY)}&output=embed`;
export const OFFICE_MAP_DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_MAP_QUERY)}`;

export const PHONE_LANDLINE = "+91 11 4629 1155";
export const PHONE_LANDLINE_HREF = "tel:+911146291155";
export const PHONE_MOBILE = "86551 68551";
export const PHONE_MOBILE_HREF = "tel:+918655168551";

export const EMAIL_LOANS = "loans@indexiafinance.com";
export const EMAIL_CONTACT = "contactus@indexiafinance.com";
export const EMAIL_SUPPORT = "support@indexiafinance.com";
