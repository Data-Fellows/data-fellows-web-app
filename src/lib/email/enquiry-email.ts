import type { Enquiry } from "@/types/enquiry";
import type { EmailMessage } from "./types";

// Escapes user-submitted text before it's interpolated into the notification
// email's HTML body -- every field below (name, organization, problem
// description, etc.) is visitor-controlled input, so this is the one thing
// standing between a crafted submission and injected markup/script in an
// email client that renders HTML. Plain &/</>/quote escaping is enough
// here: we're not building any other HTML from this input.
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const FIELD_LABELS: { key: keyof Enquiry; label: string }[] = [
  { key: "full_name", label: "Full name" },
  { key: "work_email", label: "Work email" },
  { key: "organization", label: "Organization" },
  { key: "enquiry_type", label: "Enquiry type" },
  { key: "problem_description", label: "Description of the problem" },
  { key: "existing_systems", label: "Relevant existing systems or tools" },
  { key: "timeframe", label: "Desired project timeframe" },
  { key: "heard_about", label: "How they heard about Data Fellows" },
];

export const buildEnquiryNotificationEmail = (
  enquiry: Enquiry,
  notifyTo: string,
  fromAddress: string
): EmailMessage => {
  const subjectIdentifier = enquiry.organization || enquiry.full_name;
  const subject = `[Data Fellows Enquiry] ${enquiry.enquiry_type} — ${subjectIdentifier}`;

  const rows = FIELD_LABELS.map(({ key, label }) => {
    const value = enquiry[key];
    if (!value) return null;
    return { label, value: String(value) };
  }).filter((row): row is { label: string; value: string } => row !== null);

  const submittedAt = new Date(enquiry.created_at).toUTCString();

  const htmlRows = rows
    .map(
      ({ label, value }) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#666;white-space:nowrap;vertical-align:top;"><strong>${escapeHtml(
          label
        )}</strong></td><td style="padding:6px 0;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;font-size:14px;color:#111;">
      <p>New enquiry submitted through the Data Fellows website contact form.</p>
      <table style="border-collapse:collapse;">${htmlRows}</table>
      <p style="margin-top:16px;color:#666;">
        Reference ID: ${escapeHtml(enquiry.id)}<br/>
        Submitted: ${escapeHtml(submittedAt)}
      </p>
    </div>
  `.trim();

  const text = [
    ...rows.map(({ label, value }) => `${label}: ${value}`),
    "",
    `Reference ID: ${enquiry.id}`,
    `Submitted: ${submittedAt}`,
  ].join("\n");

  return {
    to: notifyTo,
    from: fromAddress,
    subject,
    html,
    text,
    // Reply-To only -- the visitor's address is never used as the sender,
    // per the brief ("not as a spoofed sender address").
    replyTo: enquiry.work_email,
  };
};

// Visitor-facing acknowledgement -- sent from a verified sender, never
// promises a specific response time (per the brief), and carries no
// promotional content since the visitor hasn't opted into anything.
export const buildEnquiryAcknowledgementEmail = (
  enquiry: Enquiry,
  fromAddress: string
): EmailMessage => {
  const html = `
    <div style="font-family:sans-serif;font-size:14px;color:#111;">
      <p>Hi ${escapeHtml(enquiry.full_name.split(" ")[0] || enquiry.full_name)},</p>
      <p>Thanks for reaching out to Data Fellows. We've received your message and someone from the team will review it.</p>
      <p style="color:#666;">Your reference ID: ${escapeHtml(enquiry.id)}</p>
    </div>
  `.trim();

  const text = `Hi ${enquiry.full_name.split(" ")[0] || enquiry.full_name},\n\nThanks for reaching out to Data Fellows. We've received your message and someone from the team will review it.\n\nYour reference ID: ${enquiry.id}`;

  return {
    to: enquiry.work_email,
    from: fromAddress,
    subject: "We received your message — Data Fellows",
    html,
    text,
  };
};
