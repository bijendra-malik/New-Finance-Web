import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

export interface SocialLink {
  name: string;
  handle: string;
  url: string;
  icon: IconType;
  brand: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    handle: "Indexia Finance",
    url: "https://www.facebook.com/IndexiaFin",
    icon: FaFacebookF,
    brand: "#1877F2",
  },
  {
    name: "X",
    handle: "@indexiafinance",
    url: "https://x.com/FinanceIndexia?s=20",
    icon: FaXTwitter,
    brand: "#111827",
  },
  {
    name: "Instagram",
    handle: "@indexiafinance",
    url: "https://www.instagram.com/finance.indexia/",
    icon: FaInstagram,
    brand: "#E4405F",
  },
  {
    name: "LinkedIn",
    handle: "Indexia Finance",
    url: "https://www.linkedin.com/in/indexia-finance",
    icon: FaLinkedinIn,
    brand: "#0A66C2",
  },
  {
    name: "YouTube",
    handle: "Indexia Finance",
    url: "https://youtube.com/@financeindexia?si=jUrZw2npNHxrmKCL",
    icon: FaYoutube,
    brand: "#FF0000",
  },
];
