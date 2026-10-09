export type LoanApplicationStatus = "Submitted";

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
