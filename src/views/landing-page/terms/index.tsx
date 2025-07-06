import LandingPageLayout from "@/layouts/landing-page";
import { easeOut, motion } from "framer-motion";
import Head from "next/head";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

export default function TermsAndConditions() {
  return (
    <>
      <Head>
        <title>Terms and Conditions - Data Fellows</title>
        <meta
          name="description"
          content="Terms and conditions for using Data Fellows platform. Read our legal terms and user agreements."
        />
        <meta
          name="keywords"
          content="terms, conditions, legal, agreement, Data Fellows"
        />
        <meta
          property="og:title"
          content="Terms and Conditions - Data Fellows"
        />
        <meta
          property="og:description"
          content="Terms and conditions for using Data Fellows platform."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Terms and Conditions - Data Fellows"
        />
        <meta
          name="twitter:description"
          content="Terms and conditions for using Data Fellows platform."
        />
      </Head>

      <LandingPageLayout>
        <div className="min-h-screen bg-background">
          <main className="pt-20">
            {/* Hero Section */}
            <section className="relative py-16 px-4">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="text-center mb-12"
                >
                  <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                    Terms and Conditions
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Please read these terms and conditions carefully before
                    using our platform.
                  </p>
                  <div className="text-sm text-muted-foreground mt-4">
                    Last updated:{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Terms Content */}
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
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        1. Acceptance of Terms
                      </h2>
                      <p className="text-muted-foreground">
                        By accessing and using the Data Fellows platform, you
                        acknowledge that you have read, understood, and agree to
                        be bound by these Terms and Conditions. If you do not
                        agree with these terms, please do not use our services.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        2. Description of Service
                      </h2>
                      <p className="text-muted-foreground">
                        Data Fellows is a platform that connects businesses with
                        skilled data professionals. We provide tools for project
                        matching, communication, milestone tracking, and
                        collaboration between employers and data fellows.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        3. User Accounts
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          3.1. You must create an account to access certain
                          features of our platform.
                        </p>
                        <p>
                          3.2. You are responsible for maintaining the
                          confidentiality of your account credentials.
                        </p>
                        <p>
                          3.3. You must provide accurate and complete
                          information when creating your account.
                        </p>
                        <p>
                          3.4. You are responsible for all activities that occur
                          under your account.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        4. User Responsibilities
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          4.1. Use the platform in accordance with applicable
                          laws and regulations.
                        </p>
                        <p>
                          4.2. Provide accurate information in your profile and
                          project descriptions.
                        </p>
                        <p>
                          4.3. Respect the intellectual property rights of
                          others.
                        </p>
                        <p>
                          4.4. Maintain professional conduct in all interactions
                          on the platform.
                        </p>
                        <p>
                          4.5. Do not use the platform for illegal, harmful, or
                          fraudulent activities.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        5. Platform Services
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          5.1. Data Fellows provides a platform for connecting
                          employers with data professionals.
                        </p>
                        <p>
                          5.2. We facilitate communication, project management,
                          and milestone tracking.
                        </p>
                        <p>
                          5.3. We do not guarantee the quality of work or
                          successful project completion.
                        </p>
                        <p>
                          5.4. Users are responsible for their own agreements
                          and contracts.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        6. Privacy and Data Protection
                      </h2>
                      <p className="text-muted-foreground">
                        Your privacy is important to us. Please review our
                        Privacy Policy to understand how we collect, use, and
                        protect your personal information. By using our
                        platform, you consent to the collection and use of your
                        information as described in our Privacy Policy.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        7. Intellectual Property
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          7.1. The Data Fellows platform and its content are
                          protected by intellectual property laws.
                        </p>
                        <p>
                          7.2. Users retain ownership of their own content and
                          work products.
                        </p>
                        <p>
                          7.3. By using the platform, you grant us a license to
                          use your content as necessary to provide our services.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        8. Limitation of Liability
                      </h2>
                      <p className="text-muted-foreground">
                        Data Fellows shall not be liable for any indirect,
                        incidental, special, or consequential damages arising
                        from your use of the platform. Our total liability shall
                        not exceed the amount paid by you for our services in
                        the twelve months preceding the claim.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        9. Termination
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          9.1. Either party may terminate their account at any
                          time.
                        </p>
                        <p>
                          9.2. We reserve the right to suspend or terminate
                          accounts that violate these terms.
                        </p>
                        <p>
                          9.3. Upon termination, your access to the platform
                          will be discontinued.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        10. Changes to Terms
                      </h2>
                      <p className="text-muted-foreground">
                        We reserve the right to modify these Terms and
                        Conditions at any time. We will notify users of
                        significant changes. Continued use of the platform after
                        changes constitutes acceptance of the new terms.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        11. Contact Information
                      </h2>
                      <p className="text-muted-foreground">
                        If you have any questions about these Terms and
                        Conditions, please contact us at:
                      </p>
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <p className="text-foreground font-medium">
                          Data Fellows
                        </p>
                        <p className="text-muted-foreground">
                          Email: legal@datafellows.com
                        </p>
                        <p className="text-muted-foreground">
                          Address: [Your Company Address]
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
