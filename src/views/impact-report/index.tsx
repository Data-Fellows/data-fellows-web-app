import PageSeo from "@/components/seo/page-seo";
import LandingPageLayout from "@/layouts/landing-page";
import Image from "next/image";
import Link from "next/link";
import { FiDownload } from "react-icons/fi";

const PDF_PATH = "/documents/data-fellows-impact-report-2026.pdf";
const OG_IMAGE_PATH = "/images/impact-report-og.jpg";

const PAGE_TITLE = "Data Fellows Impact Report | Four Years of Clarity";
const PAGE_DESCRIPTION =
  "Four years of turning data into clarity, across 33+ countries. See our community, our programs, Inscend, and what's ahead.";

const ImpactReportPage = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        path="/impact-report"
        image={OG_IMAGE_PATH}
      />

      <div className="pt-28 md:pt-32">
        <section className="px-4 sm:px-6">
          <div className="mx-auto max-w-4xl overflow-hidden border border-border bg-background">
            <div className="relative aspect-[1200/630] w-full">
              <Image
                src={OG_IMAGE_PATH}
                alt="Data Fellows team at a community event"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="space-y-6 px-6 py-10 text-center sm:px-12">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Four-year anniversary
              </span>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Data Fellows is 4! Read our Impact Report.
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
                {PAGE_DESCRIPTION}
              </p>
              <Link
                href={PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
              >
                Read the 2026 Impact Report
                <FiDownload className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default ImpactReportPage;
