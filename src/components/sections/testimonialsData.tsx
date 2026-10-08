/** Testimonials copy, trust metrics and the shared brand palette for this section. */
import { Shield, Star, TrendingUp, Zap } from "lucide-react";
import userImg1 from "../../assets/Users/testimonial-1.jpg";
import userImg2 from "../../assets/Users/testimonial-2.jpg";
import userImg3 from "../../assets/Users/testimonial-3.jpg";
import userImg4 from "../../assets/Users/testimonial-4.jpg"
import userImg5 from "../../assets/Users/testimonial-5.jpg"
import userImg6 from "../../assets/Users/testimonial-6.jpg"

export const BRAND_COLORS = {
  BISLERI_GREEN: "#26ae90", // teal-green
  LIME_GREEN: "#f2f231",    // yellow
  DARK_BLUE: "#066a9c",     // deep blue
  GREY: "#7b7b7b",          // neutral grey
  NAVY_DARK: "#286090",     // medium blue
  WHITE: "#FFFFFF",
  LIGHT_BG: "#F8FAFC",
  lime: "#f2f231",          // same yellow
};

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  loanType: string;
  loanAmount: string;
  rating: number;
  quote: string;
  daysAgo: string;
  accent: string;
  initials: string;
  avatar?: string;   // optional user photo
  bgGradient: string;
  isVerified: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Small Business Owner",
    location: "Delhi",
    loanType: "Business Loan",
    loanAmount: "₹2,00,000",
    rating: 5,
    quote:
      "I needed ₹2 lakhs urgently for my shop inventory. Approved in just 2 hours without any collateral. Highly recommended!",
    daysAgo: "15 days ago",
    accent: BRAND_COLORS.DARK_BLUE,
    initials: "RK",
    avatar: userImg1,
    bgGradient: `linear-gradient(135deg, ${BRAND_COLORS.DARK_BLUE}15 0%, ${BRAND_COLORS.DARK_BLUE}05 100%)`,
    isVerified: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Software Engineer",
    location: "Bangalore",
    loanType: "Personal Loan",
    loanAmount: "₹5,00,000",
    rating: 5,
    quote:
      "Needed funds for my wedding expenses. The instant personal loan saved the day — entire process was digital and transparent.",
    daysAgo: "1 month ago",
    accent: BRAND_COLORS.BISLERI_GREEN,
    initials: "PS",
    avatar: userImg2,
    bgGradient: `linear-gradient(135deg, ${BRAND_COLORS.BISLERI_GREEN}15 0%, ${BRAND_COLORS.BISLERI_GREEN}05 100%)`,
    isVerified: true,
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Marketing Manager",
    location: "Mumbai",
    loanType: "Emergency Loan",
    loanAmount: "₹1,50,000",
    rating: 5,
    quote:
      "Emergency medical expenses came up suddenly. The quick approval process was a lifesaver — best loan app in India!",
    daysAgo: "3 weeks ago",
    accent: BRAND_COLORS.NAVY_DARK,
    initials: "AP",
    avatar: userImg3,
    bgGradient: `linear-gradient(135deg, ${BRAND_COLORS.NAVY_DARK}15 0%, ${BRAND_COLORS.NAVY_DARK}05 100%)`,
    isVerified: true,
  },
  {
    id: 4,
    name: "Anjali Singh",
    role: "Graduate Student",
    location: "Chennai",
    loanType: "Education Loan",
    loanAmount: "₹8,00,000",
    rating: 5,
    quote:
      "Transparent charges and a genuinely friendly team. They helped me fund my dream of higher education abroad.",
    daysAgo: "2 months ago",
    accent: BRAND_COLORS.DARK_BLUE,
    initials: "AS",
     avatar: userImg4,
    bgGradient: `linear-gradient(135deg, ${BRAND_COLORS.DARK_BLUE}15 0%, ${BRAND_COLORS.DARK_BLUE}05 100%)`,
    isVerified: true,
  },
  {
    id: 5,
    name: "Arjun Verma",
    role: "Product Consultant",
    location: "Hyderabad",
    loanType: "Vehicle Loan",
    loanAmount: "₹6,50,000",
    rating: 4,
    quote:
      "Quickest approval I've ever seen — got my car within 2 weeks. Outstanding service from start to finish.",
    daysAgo: "5 days ago",
    accent: BRAND_COLORS.BISLERI_GREEN,
    initials: "AV",
     avatar: userImg5,
    bgGradient: `linear-gradient(135deg, ${BRAND_COLORS.BISLERI_GREEN}15 0%, ${BRAND_COLORS.BISLERI_GREEN}05 100%)`,
    isVerified: true,
  },
  {
    id: 6,
    name: "Divya Nair",
    role: "Home Buyer",
    location: "Pune",
    loanType: "Home Loan",
    loanAmount: "₹28,00,000",
    rating: 5,
    quote:
      "Excellent guidance throughout the process. They made buying our first home stress-free from day one.",
    daysAgo: "6 weeks ago",
    accent: BRAND_COLORS.GREY,
    initials: "DN",
     avatar: userImg6,
    bgGradient: `linear-gradient(135deg, ${BRAND_COLORS.GREY}15 0%, ${BRAND_COLORS.GREY}05 100%)`,
    isVerified: true,
  },
];

export const TRUST_METRICS = [
  {
    icon: Shield,
    value: "100%",
    label: "Secure & Safe",
    color: BRAND_COLORS.DARK_BLUE,
  },
  {
    icon: Zap,
    value: "2 Min",
    label: "Approval",
    color: BRAND_COLORS.BISLERI_GREEN,
  },
  {
    icon: Star,
    value: "4.9★",
    label: "Rating",
    color: BRAND_COLORS.LIME_GREEN,
  },
  {
    icon: TrendingUp,
    value: "₹1000Cr+",
    label: "Disbursed",
    color: BRAND_COLORS.NAVY_DARK,
  },
];
