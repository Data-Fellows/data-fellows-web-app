import { beforeEach, describe, expect, it, vi } from "vitest";

// Mocked before importing the handler -- vi.mock calls are hoisted above
// imports by Vitest, so this ordering is required, not stylistic.
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(),
}));
vi.mock("@/lib/email", () => ({
  getEmailProvider: vi.fn(),
}));

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getEmailProvider } from "@/lib/email";
import handler from "@/pages/api/contact/index";

type SubmitRpcResult = { id: string; created_at: string; rate_limited: boolean };

type MockSupabaseOptions = {
  submitResult?: { data: SubmitRpcResult[] | SubmitRpcResult | null; error: unknown };
};

const SUBMIT_ROW: SubmitRpcResult = {
  id: "11111111-1111-1111-1111-111111111111",
  created_at: new Date().toISOString(),
  rate_limited: false,
};

const RATE_LIMITED_ROW: SubmitRpcResult = {
  id: null as unknown as string,
  created_at: null as unknown as string,
  rate_limited: true,
};

const createMockSupabase = (opts: MockSupabaseOptions = {}) => {
  const rpcCalls: { fn: string; args: Record<string, unknown> }[] = [];

  const rpc = vi.fn(async (fn: string, args: Record<string, unknown>) => {
    rpcCalls.push({ fn, args });
    if (fn === "submit_enquiry") {
      return opts.submitResult ?? { data: [SUBMIT_ROW], error: null };
    }
    if (fn === "update_enquiry_notification") {
      return { data: null, error: null };
    }
    return { data: null, error: null };
  });

  return { rpc, rpcCalls };
};

const buildReqRes = (body: unknown, method = "POST") => {
  const json = vi.fn();
  const setHeader = vi.fn();
  const status = vi.fn(() => ({ json }));
  const req = {
    method,
    body,
    headers: { "x-forwarded-for": "203.0.113.5" },
    socket: { remoteAddress: "203.0.113.5" },
  };
  const res = { status, setHeader };
  return { req, res, json, status };
};

const validBody = {
  fullName: "Jordan Lee",
  workEmail: "jordan@example.com",
  organization: "Example Co",
  enquiryType: "Discuss a business problem",
  problemDescription: "Our reporting pipeline breaks every week.",
  existingSystems: "",
  timeframe: "",
  heardAbout: "",
  website: "",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects non-POST methods", async () => {
    const { req, res, status, json } = buildReqRes(undefined, "GET");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler(req as any, res as any);
    expect(status).toHaveBeenCalledWith(405);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it("rejects an invalid submission (missing required fields)", async () => {
    const { req, res, status, json } = buildReqRes({ fullName: "" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler(req as any, res as any);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: expect.any(String) })
    );
  });

  it("silently no-ops a honeypot-filled submission without calling the database", async () => {
    const mockSupabase = createMockSupabase();
    vi.mocked(createSupabaseServerClient).mockReturnValue(mockSupabase as never);
    vi.mocked(getEmailProvider).mockReturnValue(null);

    const { req, res, status, json } = buildReqRes({ ...validBody, website: "http://spam.example" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler(req as any, res as any);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    expect(mockSupabase.rpc).not.toHaveBeenCalled();
  });

  it("persists a valid submission via the submit_enquiry RPC and returns a reference ID, even with no email provider configured", async () => {
    const mockSupabase = createMockSupabase();
    vi.mocked(createSupabaseServerClient).mockReturnValue(mockSupabase as never);
    vi.mocked(getEmailProvider).mockReturnValue(null);

    const { req, res, status, json } = buildReqRes(validBody);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler(req as any, res as any);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, referenceId: SUBMIT_ROW.id })
    );
    expect(mockSupabase.rpcCalls[0]).toEqual(
      expect.objectContaining({ fn: "submit_enquiry" })
    );
    // Enquiry received (received + persisted) must not depend on email
    // being configured at all.
    expect(mockSupabase.rpcCalls).toContainEqual(
      expect.objectContaining({
        fn: "update_enquiry_notification",
        args: expect.objectContaining({ p_acknowledgement_status: "skipped" }),
      })
    );
  });

  it("still reports success when the enquiry is stored but the email notification fails", async () => {
    const mockSupabase = createMockSupabase();
    vi.mocked(createSupabaseServerClient).mockReturnValue(mockSupabase as never);
    vi.mocked(getEmailProvider).mockReturnValue({
      name: "fake",
      send: vi.fn(async () => ({ ok: false, error: "provider down" })),
    });

    const { req, res, status, json } = buildReqRes(validBody);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler(req as any, res as any);

    // "Enquiry received" (DB write) must be reported as success even
    // though the email notification failed -- per the brief, these are
    // distinct outcomes and a notification failure must never be told to
    // the visitor as their enquiry failing.
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    expect(mockSupabase.rpcCalls).toContainEqual(
      expect.objectContaining({
        fn: "update_enquiry_notification",
        args: expect.objectContaining({
          p_notification_status: "failed",
          p_notification_error: "provider down",
        }),
      })
    );
  });

  it("rejects submissions the RPC reports as rate-limited", async () => {
    const mockSupabase = createMockSupabase({
      submitResult: { data: [RATE_LIMITED_ROW], error: null },
    });
    vi.mocked(createSupabaseServerClient).mockReturnValue(mockSupabase as never);
    vi.mocked(getEmailProvider).mockReturnValue(null);

    const { req, res, status, json } = buildReqRes(validBody);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler(req as any, res as any);

    expect(status).toHaveBeenCalledWith(429);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    // Rate-limited means nothing was ever written -- no follow-up RPC call.
    expect(mockSupabase.rpcCalls).toHaveLength(1);
  });

  it("returns 503 when Supabase isn't configured, without pretending the enquiry was received", async () => {
    vi.mocked(createSupabaseServerClient).mockReturnValue(null);
    vi.mocked(getEmailProvider).mockReturnValue(null);

    const { req, res, status, json } = buildReqRes(validBody);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler(req as any, res as any);

    expect(status).toHaveBeenCalledWith(503);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it("returns 500 and never fabricates a reference ID when the RPC call itself fails", async () => {
    const mockSupabase = createMockSupabase({
      submitResult: { data: null, error: { message: "db down" } },
    });
    vi.mocked(createSupabaseServerClient).mockReturnValue(mockSupabase as never);
    vi.mocked(getEmailProvider).mockReturnValue(null);

    const { req, res, status, json } = buildReqRes(validBody);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler(req as any, res as any);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    expect(json.mock.calls[0][0]).not.toHaveProperty("referenceId");
  });
});
