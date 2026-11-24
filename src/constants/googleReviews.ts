export const GOOGLE_BUSINESS = {
  rating: 4.2,
  reviewCount: 96,
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
  {
    id: 3,
    name: "Farooq Azam",
    avatar: "/testimonials/Farooq-Azam.jpg",
    rating: 5,
    quote: "I taken loan thru Indexia Finance , Amazing experience with index finance, they people are very much supported and products knowledge is very good , staff very cooperative and with professional ethics. I would say it's hassle free process of getting loan through Indexia Finance.",
    reviewUrl: "https://www.google.com/maps/contrib/113432331657349467430/place/ChIJM41tLTfI5zsRd0G2d3VMEXQ/@28.6295857,77.1143586,14z/data=!4m6!1m5!8m4!1e1!2s113432331657349467430!3m1!1e1?hl=en-IN&entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQAw%3D%3D",
  },
    {
    id: 4,
    name: "Sonu Singh",
    avatar: "/testimonials/Sonu-Singh.jpg",
    rating: 5,
    quote: "Nice experience with Indexia Finance! The team was very hambal & professional, helpful, and made the entire process smooth and hassle-free. Highly recommended & specially thanks to Mr. Bijender Malik 🤝",
    reviewUrl: "https://www.google.com/maps/contrib/116342563714831588804/place/ChIJM41tLTfI5zsRd0G2d3VMEXQ/@28.5476421,77.2067687,12z/data=!4m6!1m5!8m4!1e1!2s116342563714831588804!3m1!1e1?hl=en-IN&entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQAw%3D%3D",
  },
];
