import LandingPageLayout from "@/layouts/landing-page";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FiDownload } from "react-icons/fi";

const SITE_URL = "https://www.datafellowsai.com";
const PDF_PATH = "/documents/data-fellows-impact-report-2026.pdf";
const OG_IMAGE_PATH = "/images/impact-report-og.jpg";

const PAGE_TITLE = "Data Fellows Impact Report -- Four Years of Clarity";
const PAGE_DESCRIPTION =
  "Four years of turning data into clarity, across 33 countries. See our community, our programs, Inscend, and what's ahead.";

const ImpactReportPage = () => {
  return (
    <LandingPageLayout>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/impact-report`} />
        <meta property="og:image" content={`${SITE_URL}${OG_IMAGE_PATH}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}${OG_IMAGE_PATH}`} />
      </Head>

      <div className="pt-28 md:pt-32">
        <section className="px-4 sm:px-6">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-primary/10 bg-background">
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
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                Four-year anniversary
              </span>
              <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
                Data Fellows is 4! Read our Impact Report.
              </h1>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                {PAGE_DESCRIPTION}
              </p>
              <Link
                href={PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Read the Impact Report
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
