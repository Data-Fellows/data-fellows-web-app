import type { z } from "zod";

const FIELD_LABELS: Record<string, string> = {
  slug: "Slug",
  title: "Title",
  subtitle: "Subtitle",
  description: "Description",
  start_date: "Start date",
  end_date: "End date",
  daily_commitment: "Daily commitment",
  member_target: "Member target",
  status: "Status",
  cta_join_label: "Join button label",
  cta_join_href: "Join button link",
  partner_name: "Partner name",
  lesson_url: "Lesson link",
  summary: "Summary",
  session_date: "Session date",
  registration_url: "Registration link",
  replay_url: "Replay link",
  dayId: "Day",
  memberName: "Name",
  memberEmail: "Email",
  learningNote: "Learning note",
};

// The generic "Please check the form and try again." told an admin nothing
// about which field was wrong -- this turns the first zod issue into a
// specific, human-readable message instead.
export const describeZodError = (error: z.ZodError): string => {
  const issue = error.issues[0];
  if (!issue) return "Please check the form and try again.";

  const path = issue.path.map(String);
  const dayIndex =
    path[0] === "days" && path[1] !== undefined && !Number.isNaN(Number(path[1]))
      ? Number(path[1])
      : null;
  const fieldKey = path[path.length - 1];
  const label = FIELD_LABELS[fieldKey] ?? fieldKey ?? "Form";
  const prefix = dayIndex !== null ? `Day ${dayIndex + 1} -- ` : "";

  return `${prefix}${label}: ${issue.message}`;
};
