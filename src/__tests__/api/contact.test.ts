import { describe, expect, it, vi } from "vitest";

import handler from "@/pages/api/contact/index";

const buildReqRes = (body: unknown, method = "POST") => {
  const json = vi.fn();
  const setHeader = vi.fn();
  const status = vi.fn(() => ({ json }));
  const req = { method, body };
  const res = { status, setHeader };
  return { req, res, json, status };
};

describe("POST /api/contact", () => {
  it("is retired: always returns 410, whatever the method or body", async () => {
    const { req, res, status, json } = buildReqRes({ anything: "goes" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler(req as any, res as any);
    expect(status).toHaveBeenCalledWith(410);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it("never writes anywhere -- it takes no Supabase/email dependency at all", async () => {
    const { req, res } = buildReqRes({}, "GET");
    // The import above pulls in no Supabase or email module -- this test
    // exists mainly to document that fact so a future change re-adding
    // such an import here gets noticed in review.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(410);
  });
});
