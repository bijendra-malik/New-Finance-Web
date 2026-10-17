import axiosInstance from "./axiosInstance";

/** POST /customer/application-status → application status for the supplied identity. */
export const fetchApplicationStatus = async (
  _payload: unknown,
): Promise<{ success: boolean; data: { status: string } }> => {
  const response = await axiosInstance.post<{ success: boolean; data: { status: string } }>(
    "/customer/application-status",
  );
  return response.data;
};

