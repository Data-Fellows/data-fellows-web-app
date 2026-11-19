export type EmailMessage = {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  // Set to the visitor's own address so staff can hit "Reply" and land in
  // the visitor's inbox -- never used as the envelope/from address, which
  // would be spoofing. See PART 3 "Email delivery" in the brief.
  replyTo?: string;
};

export type EmailSendResult =
  | { ok: true }
  | { ok: false; error: string };

export type EmailProvider = {
  name: string;
  send: (message: EmailMessage) => Promise<EmailSendResult>;
};
