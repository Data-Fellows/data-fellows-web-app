import type { EmailMessage, EmailProvider, EmailSendResult } from "./types";

// Plain fetch against Resend's HTTP API rather than pulling in their SDK --
// it's a single POST, and this keeps the server bundle from growing for a
// handful of calls. https://resend.com/docs/api-reference/emails/send-email
const RESEND_API_URL = "https://api.resend.com/emails";

export const createResendProvider = (apiKey: string): EmailProvider => ({
  name: "resend",
  send: async (message: EmailMessage): Promise<EmailSendResult> => {
    try {
      const response = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: message.from,
          to: [message.to],
          subject: message.subject,
          html: message.html,
          text: message.text,
          reply_to: message.replyTo,
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        return {
          ok: false,
          error: `Resend responded ${response.status}: ${body.slice(0, 500)}`,
        };
      }

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown email send error",
      };
    }
  },
});
