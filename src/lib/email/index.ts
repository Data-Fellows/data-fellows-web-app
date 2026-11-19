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
// RESEND_API_KEY is the only provider wired up today. The brief also
// floats Azure Communication Services (the team has in-house experience
// with it -- see Elijah Soladoye's "Azure Email Communication Services
// Setup Guide"); swapping providers means adding another createXProvider()
// here behind its own env var, since EmailProvider is a plain
// {name, send} interface. Picked Resend first only because its HTTP API
// needs no SDK and no Azure-specific setup to verify from this
// environment -- not a claim that it's already configured for the domain.
export const getEmailProvider = (): EmailProvider | null => {
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    return createResendProvider(resendKey);
  }
  return null;
};
