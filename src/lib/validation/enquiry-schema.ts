import { ENQUIRY_TYPES } from "@/types/enquiry";
import { z } from "zod";

// Shared between the /contact form (client-side validation via
// zodResolver) and the /api/contact handler (server-side validation) so
// the two can't drift -- client-side validation is a UX nicety, the
// server-side parse of this same schema is the actual security boundary.
export const enquirySchema = z.object({
  fullName: z.string().trim().min(1, "Enter your name").max(200),
  workEmail: z.string().trim().email("Enter a valid email").max(254),
  organization: z.string().trim().max(200).optional().or(z.literal("")),
  enquiryType: z.enum(ENQUIRY_TYPES, { message: "Choose an enquiry type" }),
  problemDescription: z
    .string()
    .trim()
    .min(1, "Tell us what you're working through")
    .max(4000),
  existingSystems: z.string().trim().max(2000).optional().or(z.literal("")),
  timeframe: z.string().trim().max(200).optional().or(z.literal("")),
  heardAbout: z.string().trim().max(200).optional().or(z.literal("")),
  // Honeypot -- see src/pages/api/contact/index.ts for why this is bounded
  // rather than max(0).
  website: z.string().max(500).optional(),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;
