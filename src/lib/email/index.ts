import { createAzureCommunicationServicesProvider } from "./azure-communication-services";
import { createResendProvider } from "./resend";
import type { EmailProvider } from "./types";

export type { EmailMessage, EmailProvider, EmailSendResult } from "./types";

// Reads the email provider lazily (at call time, same as getSupabaseEnv())
// so the app builds and runs cleanly with no email provider configured --
// every caller must handle a null return, usually by persisting the
// enquiry anyway and marking its notification "failed" for admin retry
// rather than losing the submission. See PART 3 "Reliability" in the
// brief: a submission must never be lost just because email isn't
// configured or is temporarily down.
//
// Azure Communication Services takes priority when both are configured --
// per the brief's "prefer... existing supported Azure email infrastructure
// where economical", and confirmed (not just floated) by inspecting the
// Inscend monorepo: EMAIL_HOST/EMAIL_USER/EMAIL_PASSWORD/EMAIL_FROM there
// already point at a real, working ACS resource in production
// (node/src/services/email.service.ts). This does NOT reuse Inscend's own
// credentials -- that resource is verified to send from Inscend's domain,
// not datafellowsai.com. Someone with access to that Azure Communication
// Services resource needs to add datafellowsai.com (or just
// info@datafellowsai.com) as an additional verified sender domain on it,
// then set these as this project's own env vars (same names Inscend
// uses, so its docs/check-smtp.py script applies here too):
//   EMAIL_HOST=smtp.azurecomm.net
//   EMAIL_PORT=587
//   EMAIL_USER=<resource>.<entra-app-id>.<entra-tenant-id>
//   EMAIL_PASSWORD=<that Entra app's client secret>
//   EMAIL_FROM=info@datafellowsai.com
// Resend (plain HTTP, no SDK) stays as a fallback/alternative behind
// RESEND_API_KEY -- useful if standing up a second Azure sender identity
// isn't the preferred path, or as a quick way to get email flowing before
// that's set up.
export const getEmailProvider = (): EmailProvider | null => {
  const azureHost = process.env.EMAIL_HOST;
  const azureUser = process.env.EMAIL_USER;
  const azurePassword = process.env.EMAIL_PASSWORD;
  if (azureHost && azureUser && azurePassword) {
    return createAzureCommunicationServicesProvider({
      host: azureHost,
      user: azureUser,
      password: azurePassword,
    });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    return createResendProvider(resendKey);
  }

  return null;
};
