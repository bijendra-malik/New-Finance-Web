import * as nodemailer from "nodemailer";

export const mailFrom = (): string =>
  process.env.SMTP_FROM?.trim() ||
  process.env.SMTP_USER?.trim() ||
  "no-reply@indexiafinance.com";

export const createMailTransport = (): nodemailer.Transporter | null => {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) return null;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });
};

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
