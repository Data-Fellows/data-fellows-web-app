import { MouseEvent, useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const MAILERLITE_SHARE_URL =
  "https://preview.mailerlite.io/forms/1002552/170259443867452423/share";

type NewsletterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const NewsletterModal = ({ isOpen, onClose }: NewsletterModalProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setIsLoading(true);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const stopPropagation = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Subscribe to the newsletter"
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-background shadow-2xl"
        onClick={stopPropagation}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Newsletter
            </p>
            <p className="text-base font-medium text-foreground">
              Community & Growth operations updates
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-muted"
            aria-label="Close newsletter modal"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div className="relative h-[70vh] w-full">
          {isLoading ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/80 text-center text-sm text-muted-foreground">
              <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              <p>Loading newsletter form…</p>
            </div>
          ) : null}
          <iframe
            src={MAILERLITE_SHARE_URL}
            title="Newsletter signup form"
            className="h-full w-full border-0"
            loading="lazy"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default NewsletterModal;
