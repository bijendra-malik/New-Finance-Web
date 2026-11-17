import { createMailTransport, escapeHtml, mailFrom } from "./mail.ts";

const EXPERIENCE_LEVELS = ["Fresher", "Less than 1 year", "1-2 years", "2-5 years", "5+ years"];
const ABOUT_MAX_LENGTH = 200;
const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONTENT_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export interface CareersApiResult {
  status: number;
  body: Record<string, unknown> & { success: boolean; message: string };
}

const fail = (status: number, message: string): CareersApiResult => ({
  status,
  body: { success: false, message },
});

const asRecord = (body: unknown): Record<string, unknown> =>
  body && typeof body === "object" ? (body as Record<string, unknown>) : {};

const readString = (body: Record<string, unknown>, key: string): string => {
  const value = body[key];
  return typeof value === "string" ? value.trim() : "";
};

const hrMailbox = (): string => process.env.CAREERS_EMAIL?.trim() || "hr@indexiafinance.com";

export const handleCareerApplication = async (body: unknown): Promise<CareersApiResult> => {
  const payload = asRecord(body);
  const fullName = readString(payload, "fullName");
  const email = readString(payload, "email").toLowerCase();
  const phone = readString(payload, "phone").replace(/\D/g, "").slice(-10);
  const experience = readString(payload, "experience");
  const role = readString(payload, "role");
  const department = readString(payload, "department");
  const about = readString(payload, "about");

  if (fullName.length < 2) return fail(400, "Please enter your full name");
  if (!EMAIL_RE.test(email)) return fail(400, "Please enter a valid email address");
  if (phone.length !== 10) return fail(400, "Please enter a valid 10-digit phone number");
  if (!EXPERIENCE_LEVELS.includes(experience)) return fail(400, "Please choose your experience level");
  if (!role) return fail(400, "Please choose the role you are applying for");
  if (!about) return fail(400, "Please tell us a little about yourself");
  if (about.length > ABOUT_MAX_LENGTH) {
    return fail(400, `Please keep "Tell us about yourself" within ${ABOUT_MAX_LENGTH} characters`);
  }

  // ── Resume ────────────────────────────────────────────────────────────────
  const resume = asRecord(payload.resume);
  const fileName = readString(resume, "name");
  const rawData = readString(resume, "data");
  const base64 = rawData.includes(",") ? rawData.slice(rawData.indexOf(",") + 1) : rawData;

  if (!fileName || !base64) return fail(400, "Please attach your resume");
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return fail(415, "Your resume must be a PDF, DOC or DOCX file");
  }
  const file = Buffer.from(base64, "base64");
  if (file.length === 0) return fail(400, "That resume could not be read. Please attach it again.");
  if (file.length > MAX_RESUME_BYTES) return fail(413, "Your resume must be 5 MB or smaller");

  // ── Mail to HR ────────────────────────────────────────────────────────────
  const sender = createMailTransport();
  if (!sender) {
    return fail(503, `Applications are unavailable right now. Please email ${hrMailbox()} directly.`);
  }

  const rows: [string, string][] = [
    ["Name", fullName],
    ["Email", email],
    ["Phone", phone],
    ["Role", role],
    ["Department", department || "—"],
    ["Experience", experience],
  ];

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#0c2a4d;line-height:1.6">
  <h2 style="margin:0 0 4px">New job application</h2>
  <p style="margin:0 0 16px;color:#7b7b7b;font-size:13px">${escapeHtml(role)}${department ? ` · ${escapeHtml(department)}` : ""}</p>
  <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:14px">
    ${rows
      .map(
        ([label, value]) =>
          `<tr><td style="color:#7b7b7b;padding-right:14px">${escapeHtml(label)}</td><td><strong>${escapeHtml(value)}</strong></td></tr>`,
      )
      .join("\n    ")}
  </table>
  <h3 style="margin:20px 0 6px;font-size:14px">Tell us about themselves</h3>
  <p style="margin:0;white-space:pre-wrap">${escapeHtml(about)}</p>
  <p style="margin-top:20px;color:#7b7b7b;font-size:12px">Resume attached: ${escapeHtml(fileName)}</p>
</div>`;

  const text = [
    "New job application",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Tell us about themselves:",
    about,
    "",
    `Resume attached: ${fileName}`,
  ].join("\n");

  try {
    await sender.sendMail({
      from: mailFrom(),
      to: hrMailbox(),
      replyTo: email,
      subject: `Job application — ${role} — ${fullName}`,
      text,
      html,
      attachments: [
        {
          filename: fileName,
          content: file,
          contentType: CONTENT_TYPES[extension] ?? "application/octet-stream",
        },
      ],
    });
  } catch {
    return fail(502, `We could not send your application. Please email ${hrMailbox()} directly.`);
  }

  return {
    status: 200,
    body: { success: true, message: `Application sent to ${hrMailbox()}.` },
  };
};
