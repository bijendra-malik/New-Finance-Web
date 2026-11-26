import axiosInstance from "./axiosInstance";
import { getApiErrorMessage } from "../utils/apiError";

export interface EligibilityRequest {
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  occupation?: string;
  creditScore: number;
  authorized: boolean;
  monthlyIncome: number;
  existingEmi: number;
}

export interface EligibilityResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

const FALLBACK =
  "We could not check your eligibility just now. Please try again in a moment.";

/** POST /eligibility/calculator/:productSlug — personal-loan, business-loan, … */
export const submitEligibility = async (
  productSlug: string,
  payload: EligibilityRequest,
): Promise<EligibilityResponse> => {
  const response = await axiosInstance
    .post<EligibilityResponse>(
      `/eligibility/calculator/${encodeURIComponent(productSlug)}`,
      payload,
    )
    .catch((error: unknown) => {
      throw new Error(getApiErrorMessage(error, FALLBACK));
    });

  if (response.data?.success === false) {
    throw new Error(response.data.message?.trim() || FALLBACK);
  }
  return response.data;
};
