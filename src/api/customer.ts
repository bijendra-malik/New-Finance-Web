import axiosInstance from "./axiosInstance";

// GET /customer/credit-score → current score band for the signed-in customer.
export interface CreditScoreResponse {
  success: boolean;
  message?: string;
  /** Score band the backend chose to expose. */
  band?: string;
  /** Numeric score, when the backend reports one. */
  score?: number;
  /** Human-readable headline for the band. */
  headline?: string;
  /** Short explanation of what the band means. */
  description?: string;
}

export const fetchCreditScore = async (): Promise<CreditScoreResponse> => {
  const response = await axiosInstance.get<CreditScoreResponse>("/customer/credit-score");
  return response.data;
};
