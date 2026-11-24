import { useEffect, useRef, useState } from "react";

const FORM_SCRIPT_SRC = "https://js-na3.hsforms.net/forms/embed/342968824.js";

// How long we wait after the script loads for HubSpot to actually render
// an iframe into the container before assuming the embed failed and
// showing the fallback link. The embed itself is fast once the script
// runs, but this errs generous rather than flashing the fallback on a
// slow connection.
const EMBED_TIMEOUT_MS = 8000;

type HubSpotFormEmbedProps = {
  portalId: string;
  formId: string;
  region: string;
  // HubSpot doesn't give us a simple standalone URL for a single embedded
  // form the way it does for a meetings link, so the fallback here is an
  // email address rather than an "open in a new tab" link.
  fallbackEmail: string;
};

// Renders HubSpot's embed as plain DOM nodes created in an effect, not as
// JSX -- HubSpot's script finds the container by class/data-attributes and
// injects an iframe into it directly, outside React's knowledge. If this
// were JSX, React would later try to reconcile against nodes it didn't
// create and throw on unmount (e.g. navigating away and back via
// client-side routing). The cleanup clears the container so a remount
// starts clean and re-runs the script, which is what makes the embed
// reappear correctly after a SPA navigation rather than only on a full
// page load.
export const HubSpotFormEmbed = ({
  portalId,
  formId,
  region,
  fallbackEmail,
}: HubSpotFormEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setShowFallback(false);

    const formFrame = document.createElement("div");
    formFrame.className = "hs-form-frame";
    formFrame.dataset.region = region;
    formFrame.dataset.formId = formId;
    formFrame.dataset.portalId = portalId;
    container.appendChild(formFrame);

    const script = document.createElement("script");
    script.src = FORM_SCRIPT_SRC;
    script.defer = true;
    script.onerror = () => setShowFallback(true);
    container.appendChild(script);

    const timeoutId = window.setTimeout(() => {
      if (!formFrame.querySelector("iframe")) {
        setShowFallback(true);
      }
    }, EMBED_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeoutId);
      container.innerHTML = "";
    };
  }, [portalId, formId, region]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="hs-form-embed min-h-[520px] w-full"
        aria-live="polite"
      />
      {showFallback ? (
        <p className="border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          The form didn&apos;t load. Please email us directly at{" "}
          <a
            href={`mailto:${fallbackEmail}`}
            className="font-semibold text-foreground underline underline-offset-4"
          >
            {fallbackEmail}
          </a>{" "}
          and we&apos;ll follow up.
        </p>
      ) : null}
    </div>
  );
};

export default HubSpotFormEmbed;
