// Shared contract pieces for every loan-application API: the status lifecycle
// and the generic response envelopes used by the /apply and /applications
// endpoints of each product.

/** Status lifecycle stored on every backend application document. */
export type LoanApplicationStatus =
  | "Submitted"
  | "Pending"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Disbursed";

/** POST /{product}/apply → single saved application. */
export interface ApplyResponse<T> {
  success: boolean;
  data: T;
}

/** GET /{product}/applications → all applications for the logged-in user. */
export interface ApplicationsResponse<T> {
  success: boolean;
  data: T[];
}
