import { describeZodError } from "@/lib/api/zod-error";
import { checkEnquiryRateLimit, getClientIp } from "@/lib/api/rate-limit";
import {
  buildEnquiryAcknowledgementEmail,
  buildEnquiryNotificationEmail,
} from "@/lib/email/enquiry-email";
import { getEmailProvider } from "@/lib/email";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { site } from "@/constants/site";
import { enquirySchema } from "@/lib/validation/enquiry-schema";
import type { Enquiry } from "@/types/enquiry";
import type { NextApiRequest, NextApiResponse } from "next";

type ContactResponse = {
  success: boolean;
  referenceId?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const parsed = enquirySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: describeZodError(parsed.error) });
  }

  const values = parsed.data;

  if (values.website) {
    // Looks like a bot -- respond as if it worked, but never write
    // anything. Same pattern as the challenge check-in and session
    // registration endpoints.
    return res.status(201).json({ success: true, referenceId: "00000000-0000-0000-0000-000000000000" });
  }

  const supabase = createSupabaseServerClient({ req, res });
  if (!supabase) {
    return res
      .status(503)
      .json({ success: false, error: "Enquiries aren't available right now. Please email us directly." });
  }

  const ipAddress = getClientIp(req);

  const { limited, retryAfterMinutes } = await checkEnquiryRateLimit(supabase, ipAddress);
  if (limited) {
    return res.status(429).json({
      success: false,
      error: `You've sent several messages recently. Please try again in about ${retryAfterMinutes} minutes, or email us directly.`,
    });
  }

  // Durable write first -- this is "enquiry received." Everything after
  // this point (email notification, acknowledgement, HubSpot) is
  // best-effort follow-up that must never cause a successfully-stored
  // enquiry to be reported back to the visitor as failed.
  const { data: created, error: insertError } = await supabase
    .from("enquiries")
    .insert({
      full_name: values.fullName,
      work_email: values.workEmail,
      organization: values.organization || null,
      enquiry_type: values.enquiryType,
      problem_description: values.problemDescription,
      existing_systems: values.existingSystems || null,
      timeframe: values.timeframe || null,
      heard_about: values.heardAbout || null,
      ip_address: ipAddress,
    })
    .select(
      "id, full_name, work_email, organization, enquiry_type, problem_description, existing_systems, timeframe, heard_about, notification_status, notification_error, notification_attempted_at, acknowledgement_status, hubspot_synced_at, hubspot_contact_id, created_at, updated_at"
    )
    .single();

  if (insertError || !created) {
    console.error("[api/contact] failed to insert enquiry:", insertError);
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong. Please try again or email us directly." });
  }

  const enquiry = created as Enquiry;

  // From this point on, the visitor's "enquiry received" response is
  // already guaranteed. Email delivery is attempted but its outcome only
  // affects internal status columns for staff to retry -- never the
  // response already owed to the visitor.
  const provider = getEmailProvider();
  const fromAddress = process.env.CONTACT_FROM_EMAIL || `Data Fellows <${site.enquiryEmail}>`;

  if (provider) {
    const notification = buildEnquiryNotificationEmail(enquiry, site.enquiryEmail, fromAddress);
    const result = await provider.send(notification);

    await supabase
      .from("enquiries")
      .update({
        notification_status: result.ok ? "sent" : "failed",
        notification_error: result.ok ? null : result.error,
        notification_attempted_at: new Date().toISOString(),
      })
      .eq("id", enquiry.id);

    if (result.ok) {
      // Acknowledgement is a courtesy, not a promise -- failure here never
      // affects the response or the notification_status above.
      const ack = buildEnquiryAcknowledgementEmail(enquiry, fromAddress);
      const ackResult = await provider.send(ack);
      await supabase
        .from("enquiries")
        .update({ acknowledgement_status: ackResult.ok ? "sent" : "failed" })
        .eq("id", enquiry.id);
    }
  } else {
    // No provider configured -- record this honestly rather than silently
    // doing nothing, so an admin querying notification_status = 'failed'
    // (or 'pending' with no notification_attempted_at) can tell "email
    // isn't set up yet" apart from "email tried and failed."
    console.warn(
      "[api/contact] no email provider configured (RESEND_API_KEY unset) -- enquiry",
      enquiry.id,
      "stored but no notification was sent."
    );
    await supabase
      .from("enquiries")
      .update({ acknowledgement_status: "skipped" })
      .eq("id", enquiry.id);
  }

  // HubSpot sync is intentionally not implemented here -- see the PR
  // description for the assessment. The enquiry is fully usable (received,
  // persisted, staff notified or retriable) without it; hubspot_synced_at
  // stays null until a follow-up adds it behind HUBSPOT_PRIVATE_APP_TOKEN.

  return res.status(201).json({ success: true, referenceId: enquiry.id });
}
