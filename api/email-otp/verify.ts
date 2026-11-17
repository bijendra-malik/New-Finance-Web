import { handleEmailOtpVerify } from "../../server/emailOtp";

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): { json(body: unknown): void };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ success: false, message: "Method not allowed" });
    return;
  }

  const result = await handleEmailOtpVerify(req.body);
  res.setHeader("Cache-Control", "no-store");
  res.status(result.status).json(result.body);
}
