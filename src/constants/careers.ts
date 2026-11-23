/** Careers catalogue — used by the careers page and the apply form. */

export interface CareerRole {
  title: string;
  team: string;
  location: string;
  type: "Full-time" | "Intern";
  description: string;
  requirements: string[];
}

export const CAREER_ROLES: CareerRole[] = [
  {
    title: "Digital Marketing Executive",
    team: "Digital Marketing",
    location: "Delhi",
    type: "Full-time",
    description:
      "Lead digital marketing strategies including SEO, SEM, social media marketing, and content creation to drive online presence and lead generation.",
    requirements: [
      "Minimum 1 year experience in digital marketing",
      "Strong knowledge of SEO, SEM, and SMO",
      "Experience with Google Analytics, Ads, and social media tools",
      "Excellent communication and analytical skills",
    ],
  },
  {
    title: "IT Developer",
    team: "Information Technology",
    location: "Delhi",
    type: "Full-time",
    description:
      "Develop and maintain software applications, manage databases, and support IT infrastructure across the organization.",
    requirements: [
      "Minimum 1 year experience as a full-stack developer",
      "Proficiency in frontend and backend technologies",
      "Experience with databases and API development",
      "Strong problem-solving and debugging skills",
    ],
  },
  {
    title: "HR Executive",
    team: "Human Resources",
    location: "Delhi",
    type: "Full-time",
    description:
      "Manage end-to-end HR processes including profile hiring, shortlisting candidates, conducting interviews, managing joining formalities, induction, training, salary management, and exit formalities.",
    requirements: [
      "Minimum 1 year experience in HR",
      "End-to-end recruitment experience from hiring to exit",
      "Knowledge of HR policies, salary management, and employee relations",
      "Strong interpersonal and organizational skills",
    ],
  },
  {
    title: "Customer Support Associate (CSA)",
    team: "Customer Support",
    location: "Delhi",
    type: "Full-time",
    description:
      "Handle customer inquiries across all loan products, provide end-to-end support from application to disbursal, and ensure a seamless customer experience at Indexia Finserve.",
    requirements: [
      "Handle inbound/outbound calls for loan enquiries (Personal, Business, Home, LAP, etc.)",
      "Guide customers through eligibility, documentation, and application process",
      "Maintain customer records and follow up on pending applications",
      "Coordinate with banks and NBFCs for loan processing updates",
      "Resolve customer complaints and escalate issues when necessary",
      "Achieve monthly targets for customer engagement and satisfaction",
      "Strong communication skills in English and Hindi",
      "Basic knowledge of financial products and banking processes",
    ],
  },
  {
    title: "Executive Assistant to Director",
    team: "Administration",
    location: "Delhi",
    type: "Full-time",
    description:
      "Support the Director in managing multiple profiles, coordinating schedules, handling correspondence, and acting as a supporting hand for day-to-day operations.",
    requirements: [
      "Minimum 1 year experience as an EA or in a similar administrative role",
      "Ability to handle multiple profiles and priorities",
      "Excellent organizational and time management skills",
      "Proficiency in MS Office and communication tools",
      "Discretion and professionalism in handling confidential matters",
    ],
  },
  {
    title: "HR (Intern)",
    team: "Human Resources",
    location: "Delhi",
    type: "Intern",
    description:
      "Learn end-to-end HR processes including recruitment, onboarding, and employee management.",
    requirements: [
      "Currently pursuing or recently completed degree in HR/Management",
      "Strong communication and interpersonal skills",
      "Basic knowledge of HR practices",
    ],
  },
  {
    title: "Digital Marketing (Intern)",
    team: "Digital Marketing",
    location: "Delhi",
    type: "Intern",
    description:
      "Assist in digital marketing campaigns, SEO optimization, and social media management.",
    requirements: [
      "Currently pursuing or recently completed degree in Marketing/Communications",
      "Knowledge of SEO, SEM, and social media platforms",
      "Creative thinking and analytical skills",
    ],
  },
  {
    title: "IT Developer (Intern)",
    team: "Information Technology",
    location: "Delhi",
    type: "Intern",
    description: "Support IT infrastructure, software development, and technical operations.",
    requirements: [
      "Currently pursuing or recently completed degree in Computer Science/IT",
      "Basic programming knowledge",
      "Interest in software development and IT systems",
    ],
  },
  {
    title: "Finance (Intern)",
    team: "Finance",
    location: "Delhi",
    type: "Intern",
    description:
      "Gain hands-on experience in financial operations, loan processing, and banking procedures.",
    requirements: [
      "Currently pursuing or recently completed degree in Finance/Commerce",
      "Interest in financial services and banking",
      "Proficiency in MS Excel and basic financial tools",
    ],
  },
];

export const OPEN_APPLICATION = "Open application";

export const EXPERIENCE_LEVELS = [
  "Fresher",
  "Less than 1 year",
  "1-2 years",
  "2-5 years",
  "5+ years",
] as const;

/** "Tell us about yourself" is capped at 200 characters. */
export const ABOUT_MAX_LENGTH = 200;

/** Uploads are capped at 3 MB so the base64 request stays under the server limit. */
export const RESUME_MAX_BYTES = 3 * 1024 * 1024;
export const RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;
