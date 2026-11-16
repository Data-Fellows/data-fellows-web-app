import Link from "next/link";
import { useEffect, useState } from "react";
import { FiDownload, FiX } from "react-icons/fi";

const STORAGE_KEY = "df-impact-report-announcement-dismissed";
const ANNOUNCEMENT_START = new Date("2026-08-20T00:00:00Z");
const ANNOUNCEMENT_END = new Date("2026-09-15T00:00:00Z");

const ImpactReportAnnouncement = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    if (now < ANNOUNCEMENT_START || now > ANNOUNCEMENT_END) {
      return;
    }
    let alreadyDismissed = false;
    try {
      alreadyDismissed = Boolean(sessionStorage.getItem(STORAGE_KEY));
    } catch {
      // sessionStorage can throw in some mobile in-app browsers (e.g.
      // Instagram/WhatsApp webviews) or restrictive privacy modes --
      // treat that as "not dismissed" rather than silently failing.
    }
    if (!alreadyDismissed) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Ignore -- worst case the announcement reappears next load.
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const { body } = document;
    const originalOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = originalOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Data Fellows Impact Report announcement"
    >
      <div
        className="relative w-full max-w-md border border-border bg-background p-6 text-center shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center border border-border text-foreground transition hover:bg-muted"
          aria-label="Close announcement"
        >
          <FiX className="h-4 w-4" />
        </button>
        <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Four-year anniversary
        </span>
        <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground">
          Data Fellows is 4! Read our Impact Report.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Four years of turning data into clarity, across 33 countries. See
          the full story.
        </p>
        <Link
          href="/documents/data-fellows-impact-report-2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
        >
          Read the 2026 Impact Report
          <FiDownload className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={handleClose}
          className="mt-3 text-xs font-medium text-muted-foreground hover:underline"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default ImpactReportAnnouncement;
