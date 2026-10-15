export type LoanApplicationStatus = "Submitted";

/** POST /customer/loan-apply → single saved application. */
export interface ApplyResponse<T> {
  success: boolean;
  data: T;
}

/** GET /customer/loan-apply?product={product} → all applications for the logged-in user. */
export interface ApplicationsResponse<T> {
  success: boolean;
  data: T[];
}
