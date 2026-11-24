// Thin wrapper around the gtag() call _document.tsx already sets up for
// GA4 pageviews. Safe to call from anywhere: no-ops server-side, and
// no-ops when GA isn't configured (gtag only exists on window when
// NEXT_PUBLIC_GA_MEASUREMENT_ID is set -- see _document.tsx), so this
// follows the exact same "nothing happens until GA is configured"
// behavior the existing pageview tracking already has. Never pass
// visitor-submitted content (names, emails, free-text fields) as a
// param -- only categorical/structural values (an enquiry type, a field
// name, a link destination).
type AnalyticsEventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const trackEvent = (
  eventName: string,
  params?: AnalyticsEventParams
) => {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
};
