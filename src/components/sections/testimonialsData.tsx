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

export const GOOGLE_BUSINESS = {
  name: "Indexia Finance",
  rating: 4.2,
  reviewCount: 92,
  asOf: "4 November 2026",
  reviewsUrl: "https://www.google.com/maps/place?q=place_id:ChIJM41tLTfI5zsRd0G2d3VMEXQ",
} as const;

export interface GoogleReview {
  id: number;
  name: string;
  initials: string;
  rating: number;
  quote: string;
  date: string;
}

export const TESTIMONIALS: GoogleReview[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    initials: "RK",
    rating: 5,
    quote:
      "Great experience with Indexia Finance! The team was professional, helpful, and made the entire process smooth and hassle-free. Highly recommended!",
    date: "14 Jul 2026",
  },
  {
    id: 2,
    name: "Priya Sharma",
    initials: "PS",
    rating: 5,
    quote: "Best loan provider company& Staff is very helpful corporated.",
    date: "7 Aug 2026",
  },
  {
    id: 3,
    name: "Amit Patel",
    initials: "AP",
    rating: 5,
    quote:
      "Good experience and transparent communication, efficient disbursal times, and ability to secure difficult loans.",
    date: "11 Jul 2026",
  },
  {
    id: 4,
    name: "Anjali Singh",
    initials: "AS",
    rating: 5,
    quote: "Very informative & useful . I learned lot of this company thank you",
    date: "7 Aug 2026",
  },
  {
    id: 5,
    name: "Arjun Verma",
    initials: "AV",
    rating: 5,
    quote:
      "I've had a positive experience with Indexia Finance. Their services are high quality, and I appreciate the…",
    date: "13 Aug 2024",
  },
];
