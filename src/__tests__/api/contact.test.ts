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

type MockSupabaseOptions = {
  rateLimitCount?: number;
  rateLimitError?: { message: string } | null;
  insertResult?: { data: unknown; error: unknown };
};

const VALID_ENQUIRY = {
  id: "11111111-1111-1111-1111-111111111111",
  full_name: "Jordan Lee",
  work_email: "jordan@example.com",
  organization: "Example Co",
  enquiry_type: "Discuss a business problem",
  problem_description: "Our reporting pipeline breaks every week.",
  existing_systems: null,
  timeframe: null,
  heard_about: null,
  notification_status: "pending",
  notification_error: null,
  notification_attempted_at: null,
  acknowledgement_status: "pending",
  hubspot_synced_at: null,
  hubspot_contact_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const createMockSupabase = (opts: MockSupabaseOptions = {}) => {
  const updateCalls: Record<string, unknown>[] = [];

  const from = vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        gte: vi.fn(async () => ({
          count: opts.rateLimitCount ?? 0,
          error: opts.rateLimitError ?? null,
        })),
      })),
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(async () => opts.insertResult ?? { data: VALID_ENQUIRY, error: null }),
      })),
    })),
    update: vi.fn((payload: Record<string, unknown>) => {
      updateCalls.push(payload);
      return { eq: vi.fn(async () => ({ data: null, error: null })) };
    }),
  }));

  return { from, updateCalls };
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

  it("silently no-ops a honeypot-filled submission without touching the database", async () => {
    const mockSupabase = createMockSupabase();
    vi.mocked(createSupabaseServerClient).mockReturnValue(mockSupabase as never);
    vi.mocked(getEmailProvider).mockReturnValue(null);

    const { req, res, status, json } = buildReqRes({ ...validBody, website: "http://spam.example" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler(req as any, res as any);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("persists a valid submission and returns a reference ID, even with no email provider configured", async () => {
    const mockSupabase = createMockSupabase();
    vi.mocked(createSupabaseServerClient).mockReturnValue(mockSupabase as never);
    vi.mocked(getEmailProvider).mockReturnValue(null);

    const { req, res, status, json } = buildReqRes(validBody);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler(req as any, res as any);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, referenceId: VALID_ENQUIRY.id })
    );
    // Enquiry received (received + persisted) must not depend on email
    // being configured at all.
    expect(mockSupabase.updateCalls).toContainEqual(
      expect.objectContaining({ acknowledgement_status: "skipped" })
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
    expect(mockSupabase.updateCalls).toContainEqual(
      expect.objectContaining({ notification_status: "failed", notification_error: "provider down" })
    );
  });

  it("rejects submissions once the per-IP rate limit is exceeded", async () => {
    const mockSupabase = createMockSupabase({ rateLimitCount: 5 });
    vi.mocked(createSupabaseServerClient).mockReturnValue(mockSupabase as never);
    vi.mocked(getEmailProvider).mockReturnValue(null);

    const { req, res, status, json } = buildReqRes(validBody);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler(req as any, res as any);

    expect(status).toHaveBeenCalledWith(429);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
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

  it("returns 500 and never fabricates a reference ID when the database insert itself fails", async () => {
    const mockSupabase = createMockSupabase({
      insertResult: { data: null, error: { message: "db down" } },
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
