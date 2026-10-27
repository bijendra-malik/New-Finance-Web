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

export interface DraftActionResponse {
  success: boolean;
  message?: string;
}

// DELETE /customer/loan-apply/draft { draftId }
export const deleteLoanApplyDraft = async (
  draftId: string,
): Promise<DraftActionResponse> => {
  const response = await axiosInstance.delete<DraftActionResponse>(
    "/customer/loan-apply/draft",
    { data: { draftId } },
  );
  return response.data;
};

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
