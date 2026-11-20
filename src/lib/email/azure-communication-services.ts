import nodemailer from "nodemailer";
import type { EmailMessage, EmailProvider, EmailSendResult } from "./types";

// Azure Communication Services, over SMTP -- the same pattern already
// proven in production in the Inscend monorepo's EmailService
// (node/src/services/email.service.ts), not guessed at from Microsoft's
// docs. Reusing it here rather than inventing a different integration.
//
// ACS's documented SMTP relay is smtp.azurecomm.net on port 587
// (recommended) or 25, with STARTTLS and TLS 1.2+. It does NOT offer
// implicit TLS on 465 -- Inscend's own history is a cautionary tale here:
// every one of their deployed environments silently pointed at 465 for
// weeks (derived from NODE_ENV instead of being read from the actual
// port), which meant every send opened a connection nothing was
// listening on, timed out, and was swallowed into a generic "failed"
// state. `secure`/`requireTLS` below are deliberately derived from the
// port, not configurable independently, so that specific mistake can't
// happen again here.
const SMTP_TIMEOUTS = {
  dnsTimeout: 5_000,
  connectionTimeout: 5_000,
  greetingTimeout: 5_000,
  socketTimeout: 10_000,
};

const DEFAULT_SMTP_PORT = 587;

const smtpPort = () => {
  const configured = Number(process.env.EMAIL_PORT);
  return Number.isInteger(configured) && configured > 0 ? configured : DEFAULT_SMTP_PORT;
};

export const createAzureCommunicationServicesProvider = (config: {
  host: string;
  user: string;
  password: string;
}): EmailProvider => {
  const port = smtpPort();
  const implicitTls = port === 465;

  const transporter = nodemailer.createTransport({
    ...SMTP_TIMEOUTS,
    host: config.host,
    port,
    secure: implicitTls,
    requireTLS: !implicitTls,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });

  return {
    name: "azure-communication-services",
    send: async (message: EmailMessage): Promise<EmailSendResult> => {
      try {
        await transporter.sendMail({
          from: message.from,
          to: message.to,
          subject: message.subject,
          html: message.html,
          text: message.text,
          replyTo: message.replyTo,
        });
        return { ok: true };
      } catch (error) {
        // Inscend's own history (see the comment above) is the reason this
        // error is surfaced in full rather than collapsed to a boolean --
        // that collapse is exactly what hid a transport misconfiguration
        // for weeks in production there.
        return {
          ok: false,
          error: error instanceof Error ? error.message : "Unknown email send error",
        };
      }
    },
  };
};
