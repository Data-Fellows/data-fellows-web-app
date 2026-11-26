import { HubSpotMeetingsEmbed } from "@/components/custom/hubspot-meetings-embed";
import PageSeo from "@/components/seo/page-seo";
import { hubspot } from "@/constants/site";
import LandingPageLayout from "@/layouts/landing-page";

const BookPage = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title="Book a Session | Data Fellows"
        description="Book a session with Data Fellows about the Studio, a technical project, or a possible collaboration."
        path="/book"
      />
      <div className="space-y-12 pt-28 md:pt-32">
        <section className="px-4 sm:px-6" aria-labelledby="book-hero-heading">
          <div className="mx-auto max-w-4xl border border-border bg-muted/40 px-6 py-12 text-center lg:px-12">
            <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Book a Session
            </span>
            <h1
              id="book-hero-heading"
              className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Choose a time to connect
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Choose a time to discuss the Studio, a technical project, or a possible collaboration with Data Fellows.
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="book-calendar-heading">
          <div className="mx-auto max-w-4xl">
            <h2 id="book-calendar-heading" className="sr-only">
              Pick a time
            </h2>
            <HubSpotMeetingsEmbed meetingUrl={hubspot.meetingsUrl} />
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default BookPage;
