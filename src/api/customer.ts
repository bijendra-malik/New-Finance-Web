import axiosInstance from "./axiosInstance";

export interface CreditScoreResponse {
  success: boolean;
  message?: string;
  eligible?: boolean;
  isEligible?: boolean;
  band?: string;
  score?: number;
  headline?: string;
  description?: string;
  data?: unknown;
  application?: unknown;
}

export const submitCreditScore = async (
  draftId: string,
  creditScore: number,
): Promise<CreditScoreResponse> => {
  const response = await axiosInstance.post<CreditScoreResponse>(
    "/customer/credit-score",
    { draftId, creditScore },
  );
  return response.data;
};
