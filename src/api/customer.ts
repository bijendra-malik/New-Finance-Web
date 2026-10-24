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

/** The in-progress loan-apply draft for the signed-in customer. */
export interface LoanApplyDraft {
  draftId?: string;
  _id?: string;
  product?: string;
  nextStep?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface LoanApplyDraftResponse {
  success: boolean;
  message?: string;
  data?: LoanApplyDraft | { draft?: LoanApplyDraft } | null;
  draft?: LoanApplyDraft;
  nextStep?: string;
}

export interface DraftActionResponse {
  success: boolean;
  message?: string;
}

/**
 * The signed-in customer's in-progress loan-apply draft, as the last
 * `POST /customer/loan-apply` left it.
 * GET /customer/loan-apply/draft
 */
export const fetchLoanApplyDraft = async (): Promise<LoanApplyDraftResponse> => {
  const response = await axiosInstance.get<LoanApplyDraftResponse>(
    "/customer/loan-apply/draft",
  );
  return response.data;
};

/**
 * Discard the signed-in customer's in-progress loan-apply draft.
 * DELETE /customer/loan-apply/draft
 */
export const deleteLoanApplyDraft = async (): Promise<DraftActionResponse> => {
  const response = await axiosInstance.delete<DraftActionResponse>(
    "/customer/loan-apply/draft",
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
