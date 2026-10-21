import axiosInstance from "./axiosInstance";

export interface CreditScoreResponse {
  success: boolean;
  message?: string;
  band?: string;
  score?: number;
  headline?: string;
  description?: string;
}

export const fetchCreditScore = async (
  draftId?: string | null,
): Promise<CreditScoreResponse> => {
  const response = await axiosInstance.post<CreditScoreResponse>(
    "/customer/credit-score",
    draftId ? { draftId } : {},
  );
  return response.data;
};
