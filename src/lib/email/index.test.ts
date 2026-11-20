import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getEmailProvider } from "./index";

const ENV_KEYS = ["EMAIL_HOST", "EMAIL_USER", "EMAIL_PASSWORD", "RESEND_API_KEY"] as const;
const originalEnv: Record<string, string | undefined> = {};

describe("getEmailProvider", () => {
  beforeEach(() => {
    for (const key of ENV_KEYS) {
      originalEnv[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of ENV_KEYS) {
      if (originalEnv[key] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[key];
    }
  });

  it("returns null when nothing is configured", () => {
    expect(getEmailProvider()).toBeNull();
  });

  it("prefers Azure Communication Services when both are configured", () => {
    process.env.EMAIL_HOST = "smtp.azurecomm.net";
    process.env.EMAIL_USER = "resource.app-id.tenant-id";
    process.env.EMAIL_PASSWORD = "secret";
    process.env.RESEND_API_KEY = "re_test";

    const provider = getEmailProvider();
    expect(provider?.name).toBe("azure-communication-services");
  });

  it("falls back to Resend when Azure isn't fully configured", () => {
    // Partial Azure config (missing password) must not be treated as
    // configured -- a half-set credential should fall through, not
    // produce a provider that will fail on every send.
    process.env.EMAIL_HOST = "smtp.azurecomm.net";
    process.env.EMAIL_USER = "resource.app-id.tenant-id";
    process.env.RESEND_API_KEY = "re_test";

    const provider = getEmailProvider();
    expect(provider?.name).toBe("resend");
  });
});
