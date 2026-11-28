import axiosInstance from "./axiosInstance";
import { getApiErrorMessage } from "../utils/apiError";

interface ContactEnquiryPayload {
  name: string;
  mobile: string;
  email: string;
  topic: string;
  message: string;
  source: string;
}

interface ContactEnquiryResponse {
  success: boolean;
  message?: string;
}

const FALLBACK = "We could not send your enquiry just now. Please try again.";

/** POST /contact — the website's enquiry form. */
export const submitContactEnquiry = async (
  payload: ContactEnquiryPayload,
): Promise<ContactEnquiryResponse> => {
  const response = await axiosInstance
    .post<ContactEnquiryResponse>("/contact", payload)
    .catch((error: unknown) => {
      throw new Error(getApiErrorMessage(error, FALLBACK));
    });

  if (response.data?.success === false) {
    throw new Error(response.data.message?.trim() || FALLBACK);
  }
  return response.data;
};
