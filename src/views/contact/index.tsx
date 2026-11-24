import { HubSpotFormEmbed } from "@/components/custom/hubspot-form-embed";
import PageSeo from "@/components/seo/page-seo";
import { clientJourney } from "@/constants/approach";
import { hubspot, site } from "@/constants/site";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { FiArrowUpRight, FiCalendar, FiMail, FiMessageCircle, FiUsers } from "react-icons/fi";

const contactChannels = [
  {
    title: "Join the community",
    detail: "Discord, learning, events and member opportunities.",
    icon: FiUsers,
    href: site.communityUrl,
    external: true,
  },
  {
    title: "Partnerships",
    detail: site.partnerEmail,
    icon: FiMessageCircle,
    href: `mailto:${site.partnerEmail}`,
  },
  {
    title: "General inquiries, media & press",
    detail: site.email,
    icon: FiMail,
    href: `mailto:${site.email}`,
  },
];

const ContactPage = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title="Contact | Data Fellows"
        description="Tell Data Fellows what you're working on. Share a few details and our team will review your inquiry."
        path="/contact"
      />
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4" aria-labelledby="contact-hero-heading">
          <div className="mx-auto max-w-6xl border border-border bg-muted/40 px-6 py-12 lg:px-12">
            <div className="space-y-4 text-center">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Contact
              </span>
              <h1
                id="contact-hero-heading"
                className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                Let&apos;s Talk About Your Project
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
                Tell us what you&apos;re working on, whether it&apos;s
                connecting business systems, reducing repetitive work,
                improving reporting or building new software. Share a few
                details and our team will review your inquiry.
              </p>
              <div className="pt-2">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
                >
                  <FiCalendar className="h-4 w-4" />
                  Prefer to talk live? Book a Discovery Call
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4" aria-labelledby="contact-details-heading">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
            <div className="space-y-6 border border-border bg-background px-6 py-8 lg:col-span-5">
              <h2
                id="contact-details-heading"
                className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                Reach the team
              </h2>
              <p className="text-sm text-muted-foreground">
                Business problem? Use the form. For community, partnerships,
                media or anything else, use the channels below.
              </p>
              <div className="space-y-4">
                {contactChannels.map(({ title, detail, icon: Icon, href, external }) => (
                  <Link
                    key={title}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 border border-border bg-muted/40 px-5 py-4 text-sm text-muted-foreground transition hover:border-foreground/40"
                  >
                    <span className="flex h-10 w-10 items-center justify-center border border-foreground/20 text-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {title}
                      </p>
                      <p>{detail}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/book"
                className="flex items-center gap-4 border border-foreground bg-foreground/5 px-5 py-4 text-sm text-foreground transition hover:bg-foreground/10"
              >
                <span className="flex h-10 w-10 items-center justify-center border border-foreground/20 text-foreground">
                  <FiCalendar className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Book a Discovery Call
                  </p>
                  <p>Pick a time directly on our calendar.</p>
                </div>
                <FiArrowUpRight className="ml-auto h-4 w-4" />
              </Link>

              <div className="space-y-3 border-t border-border pt-6">
                <p className="font-mono text-xs font-semibold uppercase tracking-wide text-foreground">
                  What happens after you submit
                </p>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  {clientJourney.slice(1).map((item) => (
                    <li key={item.step} className="flex gap-2">
                      <span className="font-mono text-xs text-muted-foreground/70">
                        {item.step}
                      </span>
                      {item.title}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="space-y-5 border border-border bg-background px-6 py-8 lg:col-span-7">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Tell us about your project
              </h2>
              <HubSpotFormEmbed
                portalId={hubspot.portalId}
                formId={hubspot.contactFormId}
                region={hubspot.formRegion}
                fallbackEmail={site.enquiryEmail}
              />
            </div>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default ContactPage;
