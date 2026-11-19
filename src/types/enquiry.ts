// The 7 enquiry types from the brief -- kept as a single source of truth so
// the public form, the Zod schema and the DB check constraint can't drift
// from each other (the migration's check (enquiry_type in (...)) must be
// updated by hand alongside this list; Supabase doesn't let us generate a
// SQL constraint from TypeScript).
export const ENQUIRY_TYPES = [
  "Discuss a business problem",
  "Data and analytics",
  "Workflow or AI automation",
  "Custom software and integrations",
  "Ongoing support",
  "Partnership",
  "Community or general enquiry",
] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export type NotificationStatus = "pending" | "sent" | "failed";
export type AcknowledgementStatus = "pending" | "sent" | "failed" | "skipped";

export type Enquiry = {
  id: string;
  full_name: string;
  work_email: string;
  organization: string | null;
  enquiry_type: EnquiryType;
  problem_description: string;
  existing_systems: string | null;
  timeframe: string | null;
  heard_about: string | null;
  notification_status: NotificationStatus;
  notification_error: string | null;
  notification_attempted_at: string | null;
  acknowledgement_status: AcknowledgementStatus;
  hubspot_synced_at: string | null;
  hubspot_contact_id: string | null;
  created_at: string;
  updated_at: string;
};
