import type { NextApiRequest, NextApiResponse } from "next";

type ContactResponse = {
  success: boolean;
  error?: string;
};

// Retired: the /contact page now submits directly to HubSpot's own form
// embed (see src/views/contact/index.tsx), not to this route. Kept only
// as a 410 so old cached clients / direct API callers get an honest
// answer instead of a 404, and left intentionally inert -- it no longer
// touches Supabase or email, which is what makes the Privacy Policy's
// "we don't store a separate copy ourselves" claim about contact-form
// submissions true. The enquiries table, its migrations, and the
// RPC functions it reads from are left alone; this route no longer
// calls them.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactResponse>
) {
  res.setHeader("Allow", []);
  return res.status(410).json({
    success: false,
    error: "This endpoint has been retired. Please use the contact form at /contact.",
  });
}
