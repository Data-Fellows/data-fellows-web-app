import { SITE_URL } from "@/constants/site";
import { useToast } from "@/stores/context/ToastContext";
import type { ChallengeWithDays } from "@/types/challenge";
import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { FiAward, FiDownload, FiLink, FiPrinter } from "react-icons/fi";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { useMemberIdentity } from "../hooks/use-member-identity";

type CertificateResponse = {
  eligible: boolean;
  memberName: string | null;
  completedDays: number;
  totalDays: number;
  completedAt: string | null;
};

const fetchCertificate = async (slug: string, email: string) => {
  const response = await fetch(
    `/api/challenges/${slug}/certificate?email=${encodeURIComponent(email)}`
  );
  if (!response.ok) {
    throw new Error("Failed to load your certificate");
  }
  return (await response.json()) as CertificateResponse;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const formatDateRange = (start: string, end: string) =>
  `${new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${start}T00:00:00Z`))} -- ${new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${end}T00:00:00Z`))}`;

const CertificateTab = ({ challenge }: { challenge: ChallengeWithDays }) => {
  const router = useRouter();
  const { identity, hydrated } = useMemberIdentity();
  const { showToast } = useToast();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["challenge-certificate", challenge.slug, identity?.email],
    queryFn: () => fetchCertificate(challenge.slug, identity!.email),
    enabled: hydrated && !!identity?.email,
  });

  const goToTab = (tab: "check-in" | "tracker") => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, tab } },
      undefined,
      { shallow: true }
    );
  };

  if (!hydrated || (identity && isLoading)) {
    return null;
  }

  if (!identity || !data?.eligible) {
    const completedDays = data?.completedDays ?? 0;
    const totalDays = data?.totalDays ?? challenge.challenge_days.length;
    return (
      <div className="rounded-3xl border border-primary/10 bg-background px-6 py-12 text-center">
        <FiAward className="mx-auto mb-3 h-8 w-8 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Your Certificate of Participation
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {identity
            ? `${completedDays}/${totalDays} days completed. Check in for every day of ${challenge.title} to unlock your certificate.`
            : `Check in for all ${totalDays} days of ${challenge.title} to claim your certificate.`}
        </p>
        <button
          type="button"
          onClick={() => goToTab("check-in")}
          className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Go to check-in
        </button>
      </div>
    );
  }

  const challengeUrl = `${SITE_URL}/activities/challenges/${challenge.slug}`;
  const shareText = `I just completed ${challenge.title} with @DatafellowsInfo! 🎉 ${data.completedDays}/${data.totalDays} days done.`;

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(challengeUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(challengeUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(challengeUrl);
      showToast("Link copied to clipboard", "success");
    } catch {
      showToast("Couldn't copy the link -- copy it from your address bar instead.", "error");
    }
  };

  const downloadImage = async () => {
    const node = certificateRef.current;
    if (!node) return;

    // Safari (especially iOS) doesn't reliably honor <a download> for a
    // generated data: URL -- tapping it does nothing visible, which is
    // exactly the report this is fixing. Its workaround is to open the
    // image in a new tab so people can save it with the native long-press
    // "Save Image" gesture instead. That window has to be opened here,
    // synchronously inside the click handler -- Safari only allows
    // window.open() without treating it as a blocked popup while it's
    // still directly inside the user gesture, and by the time the image
    // finishes generating (several awaits below) that gesture is gone.
    const isSafari =
      typeof navigator !== "undefined" && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const preOpenedTab = isSafari ? window.open("", "_blank") : null;

    setIsDownloadingImage(true);
    // Capture a detached clone appended directly to <body>, not the node
    // in place -- html-to-image still picks up positioning/padding from
    // the certificate's real ancestors (the page's centered, padded
    // layout) even when only the certificate node itself is passed in,
    // which was leaving blank space on one side of the exported image.
    // A clone with no meaningful ancestors sidesteps that entirely.
    // Kept invisible via opacity (not moved off-screen) so it still
    // lays out normally -- positioning it off-screen broke max-w/auto
    // width sizing and produced a blank capture.
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.zIndex = "-1";
    wrapper.style.opacity = "0";
    wrapper.style.pointerEvents = "none";
    const clone = node.cloneNode(true) as HTMLElement;
    clone.classList.add("certificate-capture");
    clone.style.margin = "0";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);
    try {
      // A PNG shares far better than a PDF -- opens instantly as an image
      // on WhatsApp/Twitter/LinkedIn instead of needing a PDF viewer.
      //
      // This used to wait on requestAnimationFrame to let the clone's
      // layout settle before capture, but on Safari opening the pre-opened
      // tab above backgrounds *this* document -- and Safari fully
      // suspends rAF callbacks for background documents, so that promise
      // could hang until the user manually switched back to this tab,
      // leaving the new tab blank and the button stuck on "Generating...".
      // setTimeout still fires on a hidden page (Safari just throttles it
      // rather than stopping it outright), so it can't get stuck the same
      // way.
      await new Promise((resolve) => setTimeout(resolve, 50));
      const dataUrl = await toPng(clone, { pixelRatio: 2 });

      if (preOpenedTab) {
        const doc = preOpenedTab.document;
        doc.title = `${challenge.title} certificate`;
        doc.body.style.margin = "0";
        doc.body.style.background = "#0f172a";
        const img = doc.createElement("img");
        img.src = dataUrl;
        img.alt = "Certificate";
        img.style.display = "block";
        img.style.width = "100%";
        img.style.height = "auto";
        doc.body.appendChild(img);
        showToast("Opened in a new tab -- press and hold (or right-click) the image to save it.", "success");
      } else {
        const link = document.createElement("a");
        link.download = `${challenge.slug}-certificate.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch {
      preOpenedTab?.close();
      showToast("Couldn't generate the image. Try Print / Save as PDF instead.", "error");
    } finally {
      document.body.removeChild(wrapper);
      setIsDownloadingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        id="certificate"
        ref={certificateRef}
        className="mx-auto max-w-2xl space-y-7 rounded-3xl border border-primary/20 bg-gradient-to-b from-secondary/20 to-background px-8 py-12 text-center sm:px-14 print:border-primary/30 print:bg-none"
      >
        <div className="flex items-center justify-center gap-3">
          <Image
            src="/svgs/data-fellow.svg"
            alt="Data Fellows"
            width={120}
            height={40}
            className="h-9 w-auto"
          />
          <span className="h-8 w-px bg-primary/20" aria-hidden="true" />
          <FiAward className="h-8 w-8 text-primary" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Certificate of Participation
        </p>

        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
          {data.memberName}
        </h2>

        <p className="text-base text-muted-foreground">
          has successfully completed
          <br />
          <span className="text-lg font-semibold text-foreground">
            {challenge.title}
          </span>
        </p>

        <p className="text-sm text-muted-foreground">
          {formatDateRange(challenge.start_date, challenge.end_date)}
          {challenge.daily_commitment ? ` · ${challenge.daily_commitment} daily` : ""}
        </p>

        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          {data.completedDays}/{data.totalDays} days
          {data.completedAt ? ` · ${formatDate(data.completedAt)}` : ""}
        </span>

        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Issued by Data Fellows
          {challenge.partner_name ? ` · Powered by ${challenge.partner_name}` : ""}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
        <button
          type="button"
          onClick={downloadImage}
          disabled={isDownloadingImage}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          <FiDownload className="h-4 w-4" />
          {isDownloadingImage ? "Generating..." : "Download image"}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40"
        >
          <FiPrinter className="h-4 w-4" />
          Print / Save as PDF
        </button>
        <button
          type="button"
          onClick={() => goToTab("tracker")}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40"
        >
          Back to tracker
        </button>
      </div>

      <div className="space-y-3 print:hidden">
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Share your achievement
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={shareToTwitter}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40"
          >
            <FaXTwitter className="h-4 w-4" />
            Share on X
          </button>
          <button
            type="button"
            onClick={shareToLinkedIn}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40"
          >
            <FaLinkedin className="h-4 w-4" />
            Share on LinkedIn
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40"
          >
            <FiLink className="h-4 w-4" />
            Copy link
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateTab;
