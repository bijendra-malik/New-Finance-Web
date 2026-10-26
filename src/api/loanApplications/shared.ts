export type LoanApplicationStatus = "Submitted";

/** POST /customer/loan-apply → single saved application. */
export interface ApplyResponse<T> {
  success: boolean;
  data: T;
}
