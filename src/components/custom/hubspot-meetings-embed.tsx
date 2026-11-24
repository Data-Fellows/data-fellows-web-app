import { useEffect, useRef, useState } from "react";

const MEETINGS_SCRIPT_SRC =
  "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";

// Same generous-timeout reasoning as hubspot-form-embed.tsx.
const EMBED_TIMEOUT_MS = 8000;

type HubSpotMeetingsEmbedProps = {
  meetingUrl: string;
};

// Same plain-DOM-injection approach as HubSpotFormEmbed, for the same
// reason: HubSpot's script finds the container and injects an iframe
// directly, outside React's tree, so it's built with real DOM APIs in an
// effect rather than JSX to avoid a reconciliation conflict on unmount.
export const HubSpotMeetingsEmbed = ({
  meetingUrl,
}: HubSpotMeetingsEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setShowFallback(false);

    const meetingsDiv = document.createElement("div");
    meetingsDiv.className = "meetings-iframe-container";
    meetingsDiv.dataset.src = `${meetingUrl}?embed=true`;
    container.appendChild(meetingsDiv);

    const script = document.createElement("script");
    script.src = MEETINGS_SCRIPT_SRC;
    script.type = "text/javascript";
    script.onerror = () => setShowFallback(true);
    container.appendChild(script);

    const timeoutId = window.setTimeout(() => {
      if (!meetingsDiv.querySelector("iframe")) {
        setShowFallback(true);
      }
    }, EMBED_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeoutId);
      container.innerHTML = "";
    };
  }, [meetingUrl]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="min-h-[760px] w-full"
        aria-live="polite"
      />
      {showFallback ? (
        <p className="border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          The calendar didn&apos;t load. You can{" "}
          <a
            href={meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground underline underline-offset-4"
          >
            open the scheduler directly in a new tab
          </a>
          .
        </p>
      ) : null}
    </div>
  );
};

export default HubSpotMeetingsEmbed;
