import PageSeo from "@/components/seo/page-seo";
import { site } from "@/constants/site";
import LandingPageLayout from "@/layouts/landing-page";
import { easeOut, motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

// Bump by hand when the text below changes -- see the same note on
// src/views/terms/index.tsx.
const LAST_UPDATED = "November 24, 2026";

export default function PrivacyPolicy() {
  return (
    <>
      <PageSeo
        title="Privacy Policy | Data Fellows"
        description="How Data Fellows collects, uses and protects information submitted through its website."
        path="/privacy"
      />

      <LandingPageLayout>
        <div className="min-h-screen bg-background">
          <main className="pt-20">
            <section className="relative py-16 px-4">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="text-center mb-12"
                >
                  <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
                    Privacy Policy
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    This describes how the Data Fellows website handles
                    information you share with it.
                  </p>
                  <div className="font-mono text-xs uppercase tracking-wide text-muted-foreground mt-4">
                    Last updated: {LAST_UPDATED}
                  </div>
                </motion.div>
              </div>
            </section>

            <section className="py-16 px-4">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="prose prose-lg dark:prose-invert max-w-none"
                >
                  <div className="space-y-8">
                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        1. Scope
                      </h2>
                      <p className="text-muted-foreground">
                        This policy covers the public Data Fellows website
                        (the &quot;Site&quot;) at {site.url} -- what we
                        collect when you browse it or submit the contact
                        form, and what we do with it. A paid client
                        engagement is covered by that engagement&apos;s own
                        signed agreement, which takes precedence over this
                        page for anything it addresses.
                      </p>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        2. Information We Collect
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          2.1. <strong className="text-foreground">
                            Contact form submissions.
                          </strong>{" "}
                          The form on our{" "}
                          <Link
                            href="/contact"
                            className="font-medium text-foreground underline underline-offset-4"
                          >
                            Contact page
                          </Link>{" "}
                          is provided directly by HubSpot. When you submit
                          it, the information you provide (your name, work
                          email, company, enquiry type, description of the
                          problem, and anything optional you fill in) is
                          sent to and stored by HubSpot, not in a database
                          we operate ourselves, so our team can review and
                          respond to it. HubSpot's own privacy policy
                          governs that processing.
                        </p>
                        <p>
                          2.2. <strong className="text-foreground">
                            Booking a call.
                          </strong>{" "}
                          Our{" "}
                          <Link
                            href="/book"
                            className="font-medium text-foreground underline underline-offset-4"
                          >
                            discovery-call scheduler
                          </Link>{" "}
                          is also provided by HubSpot. Picking a time shares
                          whatever details you enter (name, email, and the
                          time you select) with HubSpot the same way.
                        </p>
                        <p>
                          2.3. <strong className="text-foreground">
                            Newsletter signup.
                          </strong>{" "}
                          Our newsletter signup form is hosted directly by
                          our third-party email provider (MailerLite).
                          Whatever you submit there goes to MailerLite under
                          their own privacy practices; we don&apos;t
                          separately collect or store it ourselves.
                        </p>
                        <p>
                          2.4. <strong className="text-foreground">
                            Site analytics.
                          </strong>{" "}
                          When configured, we use Google Analytics (GA4) to
                          understand aggregate traffic and which pages and
                          links get used -- for example, which navigation
                          links or call-to-action buttons get clicked, or
                          that an Insights article was opened. These
                          analytics events never include anything you type
                          into a form -- only categorical information like a
                          link's label or destination. Analytics collects
                          nothing until that integration is configured.
                        </p>
                        <p>
                          2.5. <strong className="text-foreground">
                            Staff accounts.
                          </strong>{" "}
                          Data Fellows staff use authenticated accounts to
                          publish content on the Site. This section
                          doesn&apos;t apply to visitors of the public Site.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        3. How We Use Information
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          3.1. To review and respond to your enquiry or
                          scheduled call.
                        </p>
                        <p>
                          3.2. To protect the Site from abuse (HubSpot's own
                          spam and bot protections on the contact form and
                          scheduler).
                        </p>
                        <p>
                          3.3. To understand, in aggregate, how the Site is
                          used, so we can improve it.
                        </p>
                        <p>
                          3.4. We do not sell your personal information, and
                          we do not use it for advertising.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        4. Who We Share It With
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          4.1. Service providers who process it on our
                          behalf: HubSpot for the contact form and
                          discovery-call scheduler, MailerLite for the
                          newsletter, and Google Analytics when configured.
                        </p>
                        <p>
                          4.2. We may disclose information if required by
                          law, or to protect the rights, safety, or
                          property of Data Fellows or others.
                        </p>
                        <p>
                          4.3. We don&apos;t otherwise share information you
                          submit with third parties.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        5. How We Protect It
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          5.1. Contact form and scheduler submissions are
                          handled directly by HubSpot, under HubSpot&apos;s
                          own security practices -- we don&apos;t operate a
                          separate database of submissions for these.
                        </p>
                        <p>
                          5.2. The Site is served over HTTPS.
                        </p>
                        <p>
                          5.3. We don&apos;t hold any specific security or
                          privacy certification today, and don&apos;t claim
                          to.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        6. Data Retention
                      </h2>
                      <p className="text-muted-foreground">
                        Contact form and scheduler submissions are retained
                        by HubSpot under its own retention practices, since
                        we don&apos;t store a separate copy ourselves.
                        Newsletter signups are likewise retained by
                        MailerLite.
                      </p>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        7. Cookies
                      </h2>
                      <p className="text-muted-foreground">
                        When Google Analytics is configured, it sets
                        cookies to distinguish visitors and sessions. The
                        Site does not currently show a cookie-consent
                        banner before these are set; depending on where a
                        visitor is located, that may need to change before
                        analytics is enabled in production. We flag this
                        rather than claim a consent mechanism that
                        doesn&apos;t exist.
                      </p>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        8. Your Choices
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          8.1. You can ask us what information we hold about
                          you, or ask us to delete a contact-form or
                          scheduler submission you made, by emailing us
                          using the details below -- we&apos;ll action that
                          directly in HubSpot.
                        </p>
                        <p>
                          8.2. You can unsubscribe from our newsletter at
                          any time using the link in any email, which is
                          handled directly by MailerLite.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        9. Children&apos;s Privacy
                      </h2>
                      <p className="text-muted-foreground">
                        The Site is intended for business use and isn&apos;t
                        directed at children. We don&apos;t knowingly
                        collect information from children.
                      </p>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        10. Changes to This Policy
                      </h2>
                      <p className="text-muted-foreground">
                        We may update this policy as the Site changes. The
                        &quot;Last updated&quot; date above reflects the
                        most recent change.
                      </p>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        11. Contact
                      </h2>
                      <p className="text-muted-foreground">
                        Questions about this policy, or a request about your
                        information, can be sent to:
                      </p>
                      <div className="mt-4 p-4 bg-muted border border-border">
                        <p className="text-foreground font-medium">
                          Data Fellows
                        </p>
                        <p className="text-muted-foreground">
                          Email: {site.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          </main>
        </div>
      </LandingPageLayout>
    </>
  );
}
