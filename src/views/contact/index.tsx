import { HubSpotFormEmbed } from "@/components/custom/hubspot-form-embed";
import PageSeo from "@/components/seo/page-seo";
import { hubspot, site } from "@/constants/site";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { FiMail, FiMessageCircle, FiUsers } from "react-icons/fi";

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
        description="Contact Data Fellows about the community, learning activities, technology projects, media or collaboration."
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
                Get in touch with Data Fellows
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
                Contact us about community participation, current programs, technical projects, media or potential collaboration.
              </p>
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
                For community, event, partnership and other questions, use the form or choose a direct contact channel.
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
              <div className="space-y-3 border-t border-border pt-6">
                <p className="font-mono text-xs font-semibold uppercase tracking-wide text-foreground">
                  Helpful context to include
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Let us know whether you are asking about joining, a learning activity, a project, media or a possible partnership. We will route your message through the existing contact process.
                </p>
              </div>
            </div>

            <div className="space-y-5 border border-border bg-background px-6 py-8 lg:col-span-7">
              {/* Keep the existing HubSpot form embed and its routing intact. */}
              <h2 className="sr-only">Send a message to Data Fellows</h2>
              <HubSpotFormEmbed
                portalId={hubspot.portalId}
                formId={hubspot.contactFormId}
                region={hubspot.formRegion}
                fallbackEmail={site.enquiryEmail}
              />
              <p className="text-xs leading-5 text-muted-foreground">
                The form is provided by HubSpot. Information you submit is shared with HubSpot and Data Fellows so we can respond. See our{" "}
                <Link href="/privacy" className="font-medium text-foreground underline underline-offset-4">
                  Privacy Notice
                </Link>.
              </p>
            </div>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default ContactPage;
