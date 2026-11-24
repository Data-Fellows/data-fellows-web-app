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

// Bump this by hand whenever the text below actually changes -- a
// computed `new Date()` would silently relabel every unrelated deploy as
// a terms update, which misrepresents what changed and when.
const LAST_UPDATED = "November 24, 2026";

export default function TermsAndConditions() {
  return (
    <>
      <PageSeo
        title="Terms and Conditions | Data Fellows"
        description="Terms and conditions for using Data Fellows' website and services."
        path="/terms"
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
                    Terms and Conditions
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Please read these terms carefully before using the Data
                    Fellows website.
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
                        1. Acceptance of Terms
                      </h2>
                      <p className="text-muted-foreground">
                        By accessing or using the Data Fellows website (the
                        &quot;Site&quot;), you agree to be bound by these
                        Terms and Conditions. If you do not agree, please do
                        not use the Site.
                      </p>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        2. What the Site Is
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          2.1. Data Fellows is an independent automation
                          studio. The Site describes our work, our community,
                          and our published writing, and lets you send us an
                          enquiry about a business problem.
                        </p>
                        <p>
                          2.2. The Site does not have public user accounts,
                          does not match you with independent contractors,
                          and does not process payments or manage project
                          milestones between third parties. It is a
                          marketing and contact website, not a marketplace
                          platform.
                        </p>
                        <p>
                          2.3. Staff of Data Fellows use authenticated,
                          internal accounts to publish content and manage
                          enquiries. This section does not apply to visitors
                          of the public Site.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        3. Using the Enquiry Form
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          3.1. The contact form on the Site is for genuine
                          business enquiries. Submitting it does not create a
                          contract, an engagement, or any obligation on
                          either side.
                        </p>
                        <p>
                          3.2. You agree to provide accurate information and
                          not to submit false, automated, or abusive
                          submissions. We may rate-limit or block
                          submissions we reasonably believe are abusive.
                        </p>
                        <p>
                          3.3. Any paid engagement with Data Fellows is
                          governed by a separate, signed agreement between
                          you and Data Fellows, not by these Terms.
                        </p>
                        <p>
                          3.4. See our{" "}
                          <Link
                            href="/privacy"
                            className="font-medium text-foreground underline underline-offset-4"
                          >
                            Privacy Policy
                          </Link>{" "}
                          for how information you submit is stored and used.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        4. Published Content and Community
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          4.1. Articles, case studies, and community content
                          on the Site are informational. They are not
                          professional, financial, or legal advice, and
                          describe our own or named contributors&apos; work
                          and views at the time of publishing.
                        </p>
                        <p>
                          4.2. Where we link to or summarize an article
                          published elsewhere, the original publisher&apos;s
                          own terms apply to that content; we link to it
                          with attribution, not as our own work.
                        </p>
                        <p>
                          4.3. Joining the Data Fellows community (via our
                          external community channel, newsletter, or
                          events) is voluntary and governed by the terms of
                          whichever third-party platform hosts that channel.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        5. Acceptable Use
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>You agree not to:</p>
                        <p>
                          5.1. Use the Site for an unlawful purpose, or to
                          transmit harmful or fraudulent content.
                        </p>
                        <p>
                          5.2. Attempt to gain unauthorized access to the
                          Site, its admin systems, or data submitted by
                          other visitors.
                        </p>
                        <p>
                          5.3. Scrape, mirror, or republish the Site&apos;s
                          content at scale without our written permission.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        6. Intellectual Property
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          6.1. The Site&apos;s design, text, and Data
                          Fellows-authored content are owned by Data
                          Fellows or used with permission, and are protected
                          by applicable intellectual property law.
                        </p>
                        <p>
                          6.2. Content we attribute to a named individual or
                          third-party publisher remains theirs; we display
                          it with attribution, not as a transfer of
                          ownership.
                        </p>
                        <p>
                          6.3. Intellectual property in any commissioned
                          client work is set out in that engagement&apos;s
                          own signed agreement, not these Terms.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        7. Third-Party Links and Services
                      </h2>
                      <p className="text-muted-foreground">
                        The Site links to third-party services (for
                        example, our community channel, social media,
                        partner programs, and a newsletter signup hosted by
                        a third-party email provider). We don&apos;t control
                        those services and aren&apos;t responsible for their
                        content, availability, or their own terms and
                        privacy practices.
                      </p>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        8. Disclaimer and Limitation of Liability
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          8.1. The Site and its content are provided
                          &quot;as is,&quot; without warranties of any kind.
                          We don&apos;t guarantee the Site will be
                          uninterrupted, error-free, or that any enquiry
                          will result in an engagement.
                        </p>
                        <p>
                          8.2. To the fullest extent permitted by law, Data
                          Fellows is not liable for indirect, incidental, or
                          consequential damages arising from your use of the
                          Site. The scope and enforceability of this
                          limitation depends on the governing jurisdiction
                          set out in Section 10.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        9. Changes to These Terms
                      </h2>
                      <p className="text-muted-foreground">
                        We may update these Terms from time to time. The
                        &quot;Last updated&quot; date above reflects the most
                        recent change. Continued use of the Site after an
                        update means you accept the revised Terms.
                      </p>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        10. Governing Law
                      </h2>
                      <p className="text-muted-foreground">
                        These Terms are governed by the laws of the
                        jurisdiction in which Data Fellows is incorporated
                        and operates.
                      </p>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                        11. Contact
                      </h2>
                      <p className="text-muted-foreground">
                        Questions about these Terms can be sent to:
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
