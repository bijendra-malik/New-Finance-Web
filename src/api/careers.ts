/** Careers application — POST /api/careers/apply (emails HR with the resume). */

export interface CareerApplicationPayload {
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  role: string;
  department?: string;
  about: string;
  resume: { name: string; data: string };
}

export interface CareerApplicationResponse {
  success: boolean;
  message: string;
}

export const submitCareerApplication = async (
  payload: CareerApplicationPayload,
): Promise<CareerApplicationResponse> => {
  let response: Response;
  try {
    response = await fetch("/api/careers/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "We could not reach the application service. Please check your connection and try again.",
    );
  }

  const data = (await response.json().catch(() => null)) as CareerApplicationResponse | null;

  if (!data) {
    throw new Error("We could not send your application just now. Please try again.");
  }
  return data;
};
