import { afterEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "./track";

// This test suite runs under vitest's default "node" environment (no
// jsdom), so `window` isn't a real global -- vi.stubGlobal gives trackEvent
// something to find without pulling in a jsdom dependency just for this.
describe("trackEvent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does nothing when window is unavailable (no global stub)", () => {
    expect(() => trackEvent("cta_click", { label: "Discuss a Problem" })).not.toThrow();
  });

  it("does nothing when window.gtag is not set", () => {
    vi.stubGlobal("window", {});
    expect(() => trackEvent("cta_click", { label: "Discuss a Problem" })).not.toThrow();
  });

  it("forwards the event name and params to window.gtag when present", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    trackEvent("enquiry_received", { enquiry_type: "Discuss a business problem" });

    expect(gtag).toHaveBeenCalledWith("event", "enquiry_received", {
      enquiry_type: "Discuss a business problem",
    });
  });

  it("forwards no params when none are given", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    trackEvent("nav_click");

    expect(gtag).toHaveBeenCalledWith("event", "nav_click", undefined);
  });
});
