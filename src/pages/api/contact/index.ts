import { describeZodError } from "@/lib/api/zod-error";
import { getClientIp } from "@/lib/api/rate-limit";
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

  // Rate-limit check, insert, and reference-ID generation all happen
  // atomically inside this one Postgres function (migration
  // 0014_enquiry_rpc_functions.sql). This isn't just tidier than a
  // separate select-then-insert -- it's required: the anon-key client
  // this route runs as has only INSERT on public.enquiries (see
  // 0012_enquiries.sql's RLS policy), so a plain .select()/.update()
  // against the table would be denied outright. A SECURITY DEFINER
  // function scoped to exactly this operation avoids widening the
  // table's RLS or needing a service-role key in application code.
  const { data: submitResult, error: submitError } = await supabase.rpc("submit_enquiry", {
    p_full_name: values.fullName,
    p_work_email: values.workEmail,
    p_organization: values.organization || null,
    p_enquiry_type: values.enquiryType,
    p_problem_description: values.problemDescription,
    p_existing_systems: values.existingSystems || null,
    p_timeframe: values.timeframe || null,
    p_heard_about: values.heardAbout || null,
    p_ip_address: ipAddress,
  });

  if (submitError) {
    console.error("[api/contact] submit_enquiry RPC failed:", submitError);
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong. Please try again or email us directly." });
  }

  // Supabase's .rpc() on a function returning `table(...)` comes back as
  // an array of rows (always exactly one here, since submit_enquiry
  // either inserts one row or returns one rate_limited row).
  const result = Array.isArray(submitResult) ? submitResult[0] : submitResult;

  if (!result) {
    console.error("[api/contact] submit_enquiry RPC returned no row");
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong. Please try again or email us directly." });
  }

  if (result.rate_limited) {
    return res.status(429).json({
      success: false,
      error: "You've sent several messages recently. Please try again in about 15 minutes, or email us directly.",
    });
  }

  // Built from the already-validated input plus the id/timestamp the RPC
  // handed back -- not re-read from the database, since the anon-key
  // client has no SELECT on this table (by design; see migration 0012).
  const enquiry: Enquiry = {
    id: result.id,
    full_name: values.fullName,
    work_email: values.workEmail,
    organization: values.organization || null,
    enquiry_type: values.enquiryType,
    problem_description: values.problemDescription,
    existing_systems: values.existingSystems || null,
    timeframe: values.timeframe || null,
    heard_about: values.heardAbout || null,
    notification_status: "pending",
    notification_error: null,
    notification_attempted_at: null,
    acknowledgement_status: "pending",
    hubspot_synced_at: null,
    hubspot_contact_id: null,
    created_at: result.created_at,
    updated_at: result.created_at,
  };

  // From this point on, the visitor's "enquiry received" response is
  // already guaranteed. Email delivery is attempted but its outcome only
  // affects internal status columns for staff to retry -- never the
  // response already owed to the visitor.
  const provider = getEmailProvider();
  // EMAIL_FROM is the name Inscend's own Azure Communication Services setup
  // already uses (see node/src/services/email.service.ts in the Inscend
  // monorepo) -- recognized here too so setting it up the same way on this
  // project doesn't require remembering a different variable name.
  // CONTACT_FROM_EMAIL wins if both happen to be set.
  const fromAddress =
    process.env.CONTACT_FROM_EMAIL ||
    process.env.EMAIL_FROM ||
    `Data Fellows <${site.enquiryEmail}>`;

  if (provider) {
    const notification = buildEnquiryNotificationEmail(enquiry, site.enquiryEmail, fromAddress);
    const sendResult = await provider.send(notification);

    await supabase.rpc("update_enquiry_notification", {
      p_id: enquiry.id,
      p_notification_status: sendResult.ok ? "sent" : "failed",
      p_notification_error: sendResult.ok ? null : sendResult.error,
    });

    if (sendResult.ok) {
      // Acknowledgement is a courtesy, not a promise -- failure here never
      // affects the response or the notification_status above.
      const ack = buildEnquiryAcknowledgementEmail(enquiry, fromAddress);
      const ackResult = await provider.send(ack);
      await supabase.rpc("update_enquiry_notification", {
        p_id: enquiry.id,
        p_acknowledgement_status: ackResult.ok ? "sent" : "failed",
      });
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
    await supabase.rpc("update_enquiry_notification", {
      p_id: enquiry.id,
      p_acknowledgement_status: "skipped",
    });
  }

  // HubSpot sync is intentionally not implemented here -- see the PR
  // description for the assessment. The enquiry is fully usable (received,
  // persisted, staff notified or retriable) without it; hubspot_synced_at
  // stays null until a follow-up adds it behind HUBSPOT_PRIVATE_APP_TOKEN.

  return res.status(201).json({ success: true, referenceId: enquiry.id });
}
