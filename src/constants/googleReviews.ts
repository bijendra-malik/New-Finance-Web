export const GOOGLE_BUSINESS = {
  rating: 4.2,
  reviewCount: 94,
  reviewsUrl: "https://www.google.com/search?gs_ssp=eJwFwTEOgCAMBdC4mhiv4OJMa5HfcARvARQJC4sLx_e9dXPNMTdF_kyZlnjSlFxRVHBZMDWRSBOe2RfcQA6egWfvw-rs6Xj7SKPUH6nGFBE&q=indexia+finance&ie=UTF-8#lrd=0x3be7c8372d6d8d33:0x74114c7577b64177,1,,,,",
} as const;

export interface GoogleReview {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  quote: string;
  reviewUrl: string;
}

export const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    id: 1,
    name: "Anuj James",
    avatar: "/testimonials/Anuj-James.jpg",
    rating: 5,
    quote:
      "Truly exceptional experience with the team. Well qualified team of professionals who understand customer needs and provide tailor made solutions. Could not have asked for more courteous, product equipped professionals.\n\nAll the Best and continue to deliver world class experience!!!!",
    reviewUrl: "https://www.google.com/maps/contrib/107098837853301951035/place/ChIJM41tLTfI5zsRd0G2d3VMEXQ/@28.6259154,77.1014415,13z/data=!4m6!1m5!8m4!1e1!2s107098837853301951035!3m1!1e1?hl=en-IN&entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQAw%3D%3D",
  },
  {
    id: 2,
    name: "Kulmeetsingh Bajaj",
    avatar: "/testimonials/Kulmeetsingh-Bajaj.jpg",
    rating: 5,
    quote: "Very good experience and very quick response 💯👍",
    reviewUrl: "https://www.google.com/maps/contrib/109908637747716239568/place/ChIJM41tLTfI5zsRd0G2d3VMEXQ/@28.6259154,77.1426402,17z/data=!4m6!1m5!8m4!1e1!2s109908637747716239568!3m1!1e1?hl=en-IN&entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQAw%3D%3D",
  },
];
