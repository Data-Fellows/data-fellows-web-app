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

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="mx-auto max-w-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm text-foreground"
                >
                  <p className="font-semibold">Draft pending legal review.</p>
                  <p className="mt-1 text-muted-foreground">
                    This is a new policy, written to describe what the Data
                    Fellows website actually does today -- it did not exist
                    before. It has not been reviewed by a lawyer. It does
                    not claim compliance with any specific privacy
                    regulation (GDPR, CCPA, or otherwise); the sections
                    flagged below need that confirmed by counsel before
                    this page is treated as final.
                  </p>
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
                          When you submit the form on our{" "}
                          <Link
                            href="/contact"
                            className="font-medium text-foreground underline underline-offset-4"
                          >
                            Contact page
                          </Link>
                          , we store the information you provide (your
                          name, work email, organization, enquiry type,
                          description of the problem, and anything optional
                          you fill in) in our database, so our team can
                          review and respond to it.
                        </p>
                        <p>
                          2.2. <strong className="text-foreground">
                            IP address.
                          </strong>{" "}
                          We record the IP address a contact-form
                          submission comes from, solely to detect and limit
                          abusive or automated submissions. It is not used
                          to identify you for any other purpose.
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
                          links get used -- for example, which call-to-
                          action buttons get clicked, or that an enquiry was
                          submitted and of what type. These analytics events
                          never include the actual text you typed into the
                          contact form (your name, email, or problem
                          description are never sent to analytics), only
                          categorical information like an enquiry type or a
                          link label. Analytics collects nothing until that
                          integration is configured.
                        </p>
                        <p>
                          2.5. <strong className="text-foreground">
                            Staff accounts.
                          </strong>{" "}
                          Data Fellows staff use authenticated accounts to
                          publish content and manage enquiries. This section
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
                          3.1. To review and respond to your enquiry,
                          including sending you an acknowledgement email and
                          our team a notification.
                        </p>
                        <p>
                          3.2. To protect the Site from abuse (rate-limiting
                          and spam prevention on the contact form).
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
                          behalf: our database provider (Supabase), the
                          email service that delivers enquiry notifications,
                          MailerLite for the newsletter, and Google
                          Analytics when configured.
                        </p>
                        <p>
                          4.2. We may disclose information if required by
                          law, or to protect the rights, safety, or
                          property of Data Fellows or others.
                        </p>
                        <p>
                          4.3. We don&apos;t otherwise share your contact-
                          form submission with third parties.
                        </p>
                        <p className="border-l-2 border-amber-500/60 pl-4">
                          <strong className="text-foreground">
                            Flagged for legal review:
                          </strong>{" "}
                          the brief that prompted this page mentioned
                          assessing a possible future HubSpot integration
                          for enquiry management. That integration is not
                          built, and no enquiry data is sent to HubSpot
                          today. If it&apos;s added later, this section
                          needs to be updated before that integration goes
                          live, not after.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        5. How We Protect It
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          5.1. Contact-form submissions are stored with
                          database-level access controls: the public Site
                          can only add a new submission, never read, list,
                          or modify existing ones. Only authenticated staff
                          accounts can view submitted enquiries.
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
                      <p className="text-muted-foreground border-l-2 border-amber-500/60 pl-4">
                        <strong className="text-foreground">
                          Flagged for legal review:
                        </strong>{" "}
                        we keep contact-form submissions to review and
                        respond to them and for our own records, but a
                        specific retention period (how long we keep an
                        enquiry after it&apos;s resolved) hasn&apos;t been
                        set yet. That should be decided and documented here
                        rather than left open-ended.
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
                          you, or ask us to delete a contact-form submission
                          you made, by emailing us using the details below.
                        </p>
                        <p>
                          8.2. You can unsubscribe from our newsletter at
                          any time using the link in any email, which is
                          handled directly by MailerLite.
                        </p>
                        <p className="border-l-2 border-amber-500/60 pl-4">
                          <strong className="text-foreground">
                            Flagged for legal review:
                          </strong>{" "}
                          this section describes what we can do on request
                          today. It doesn&apos;t assert a formal
                          region-specific rights process (such as a GDPR
                          Data Subject Access Request procedure), since none
                          currently exists -- counsel should advise whether
                          one is needed given where visitors are located.
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
