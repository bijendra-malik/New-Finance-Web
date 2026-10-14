import axiosInstance from "./axiosInstance";

/** Public lookup credentials for a submitted loan application. */
export interface ApplicationStatusRequest {
  applicationNumber: string;
  panNumber: string;
  mobile: string;
}

export interface ApplicationStatusResult {
  applicationNumber: string;
  productName?: string;
  status: string;
  submittedAt?: string;
  updatedAt?: string;
  message?: string;
}

/** POST /customer/application-status → application status for the supplied identity. */
export const fetchApplicationStatus = async (
  payload: ApplicationStatusRequest,
): Promise<ApplicationStatusResult> => {
  const response = await axiosInstance.post<{ success: boolean; data: ApplicationStatusResult }>(
    "/customer/application-status",
    payload,
  );
  return response.data.data;
};
