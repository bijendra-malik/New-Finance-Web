export const GOOGLE_BUSINESS = {
  rating: 4.2,
  reviewCount: 92,
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

export const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    id: 1,
    name: "Tannu",
    initials: "T",
    rating: 5,
    quote:
      "Great experience with Indexia Finance! The team was professional, helpful, and made the entire process smooth and hassle-free. Highly recommended!",
    date: "14 Jul 2026",
  },
  {
    id: 2,
    name: "Sagar Verma",
    initials: "SV",
    rating: 5,
    quote: "Best loan provider company& Staff is very helpful corporated.",
    date: "7 Aug 2026",
  },
  {
    id: 3,
    name: "Prerna Negi",
    initials: "PN",
    rating: 5,
    quote:
      "Good experience and transparent communication, efficient disbursal times, and ability to secure difficult loans.",
    date: "11 Jul 2026",
  },
  {
    id: 4,
    name: "Sahil Chaddha",
    initials: "SC",
    rating: 5,
    quote: "Very informative & useful . I learned lot of this company thank you",
    date: "7 Aug 2026",
  },
  {
    id: 5,
    name: "Lakshay Sharma",
    initials: "LS",
    rating: 5,
    quote:
      "I've had a positive experience with Indexia Finance. Their services are high quality, and I appreciate their commitment to customer satisfaction. The team is responsive and professional, always ready to assist with any issues or questions I…",
    date: "13 Aug 2024",
  },
];
