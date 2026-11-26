import LegalSection from "@/components/custom/legal-section";
import PageSeo from "@/components/seo/page-seo";
import { site } from "@/constants/site";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";

const LAST_UPDATED = "November 26, 2026";

export default function PrivacyPolicy() {
  return (
    <>
      <PageSeo
        title="Privacy Notice | Data Fellows"
        description="What Data Fellows collects through its website and activity tools, why it is used and how to make a privacy request."
        path="/privacy"
      />
      <LandingPageLayout>
        <main className="min-h-screen bg-background pt-28 md:pt-32">
          <section className="px-4 py-12 sm:px-6">
            <div className="mx-auto max-w-4xl space-y-4 text-center">
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Privacy Notice
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Here is what happens to information you share with Data Fellows through this website.
              </p>
              <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                Last updated: {LAST_UPDATED}
              </p>
            </div>
          </section>

          <section className="px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-4xl space-y-8">
              <LegalSection title="1. Who is responsible">
                <p>
                  Data Fellows Inc. is responsible for personal information collected through the public website at {site.url} and the public activity forms described below. This notice does not cover third-party websites or the separate Studio workspace at studio.datafellowsai.com. Review any privacy notice shown by those services before submitting information there.
                </p>
              </LegalSection>

              <LegalSection title="2. Information you give us">
                <p>
                  <strong className="text-foreground">Contact and booking.</strong> The contact form and session scheduler are provided by HubSpot. Information you enter, such as your name, email address, meeting choice and message, is sent to HubSpot so Data Fellows can respond or prepare for the meeting.
                </p>
                <p>
                  <strong className="text-foreground">Events and sessions.</strong> When you register through a form on this website, we collect your name and email address and store the registration in Supabase for event administration and updates. Some activities link to an external registration service; information submitted there is handled under that service&apos;s privacy notice.
                </p>
                <p>
                  <strong className="text-foreground">Learning challenges.</strong> A challenge check-in collects your name, email address, the day you completed and an optional learning note. We store these details in Supabase to track progress and provide participation certificates. Your name and optional note appear on the challenge&apos;s public wall. Your email address is not shown on that wall.
                </p>
                <p>
                  The challenge page saves the name and email address you enter in local storage in your browser so it can fill them in next time. This does not create a password-protected member account. You can remove the saved details by clearing site data for this website in your browser.
                </p>
                <p>
                  <strong className="text-foreground">Newsletter.</strong> The newsletter form is hosted by MailerLite. Details you submit go to MailerLite and may also be available to Data Fellows through its newsletter account so we can manage subscriptions and send the newsletter.
                </p>
              </LegalSection>

              <LegalSection title="3. Information collected when you visit">
                <p>
                  Our website hosting and security services may process technical information such as your IP address, browser and device details, requested pages, timestamps and error or security logs to deliver and protect the website.
                </p>
                <p>
                  The site loads MailerLite&apos;s universal tracking script to support newsletter features and measure site activity. Google Analytics is enabled only when its measurement ID is configured. When enabled, it receives page-view and site-use information. Our custom analytics events record navigation, button and article clicks; they are not designed to include names, email addresses or text entered into forms.
                </p>
              </LegalSection>

              <LegalSection title="4. Cookies and browser storage">
                <p>
                  The website uses browser storage to remember the name and email address entered for learning challenge check-ins. MailerLite, HubSpot and Google Analytics may use cookies or similar technologies for forms, measurement or site activity. Google Analytics loads only when it is enabled for the site.
                </p>
                <p>
                  Your browser lets you clear stored information and manage cookies. Blocking cookies or scripts may affect embedded forms and other features. The website currently has no central cookie-preference panel, so browser settings are the available way to manage cookies here.
                </p>
              </LegalSection>

              <LegalSection title="5. How we use information">
                <p>
                  We use information to respond to messages and booking requests, manage activity registrations, record challenge progress, issue certificates, display challenge contributions, send a newsletter when you subscribe, protect the site and understand how it is used.
                </p>
                <p>
                  We do not sell personal information or use it to target advertising.
                </p>
              </LegalSection>

              <LegalSection title="6. Who helps us process it">
                <p>
                  We use service providers to operate the website and its features: <a className="font-medium text-foreground underline underline-offset-4" href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noopener noreferrer">Vercel</a> for hosting, <a className="font-medium text-foreground underline underline-offset-4" href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase</a> for event and challenge records, <a className="font-medium text-foreground underline underline-offset-4" href="https://legal.hubspot.com/privacy-policy" target="_blank" rel="noopener noreferrer">HubSpot</a> for contact forms and meeting bookings, <a className="font-medium text-foreground underline underline-offset-4" href="https://www.mailerlite.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">MailerLite</a> for newsletter features, and <a className="font-medium text-foreground underline underline-offset-4" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Analytics</a> when enabled. Their privacy notices explain their own practices.
                </p>
                <p>
                  We may also disclose information when required by law or when reasonably necessary to protect people, Data Fellows or our systems. We do not otherwise share information for unrelated third-party marketing.
                </p>
              </LegalSection>

              <LegalSection title="7. Where information is processed">
                <p>
                  Our service providers may store or process information outside Ontario or Canada, including in countries where they or their service providers operate. Privacy laws in those locations may differ from the laws where you live.
                </p>
              </LegalSection>

              <LegalSection title="8. How long we keep it">
                <p>
                  We keep information for as long as it is needed to respond to you, run the activity you joined, maintain participation records, protect the website, meet legal obligations or resolve disputes. Retention periods can differ by record and provider. You may ask us to review or delete information, subject to legal and operational recordkeeping requirements.
                </p>
              </LegalSection>

              <LegalSection title="9. How we protect it">
                <p>
                  We use administrative and technical safeguards intended to protect information from loss, misuse and unauthorized access. No website or online storage system can be guaranteed completely secure.
                </p>
              </LegalSection>

              <LegalSection title="10. Your choices and privacy requests">
                <p>
                  You can unsubscribe from the newsletter using the link in a newsletter email. You can also ask to access, correct or delete personal information, or raise a concern about how it is handled. Email us at{" "}
                  <a className="font-medium text-foreground underline underline-offset-4" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>. We may ask for information to confirm your identity before responding. Your rights depend on the privacy laws that apply to you.
                </p>
                <p>
                  If you submit a learning note for a public challenge wall and later want it removed, contact us using the same email address and identify the challenge and contribution.
                </p>
              </LegalSection>

              <LegalSection title="11. Young people">
                <p>
                  Data Fellows activities may be open to learners at different stages. Any age-specific participation details will be provided with the activity. If you are a parent or guardian with a concern about information submitted by a young person, contact us.
                </p>
              </LegalSection>

              <LegalSection title="12. Changes and contact">
                <p>
                  We may update this notice when our website or information practices change. The date above shows when it was last revised.
                </p>
                <p>
                  For a privacy question or request, contact Data Fellows Inc. at{" "}
                  <a className="font-medium text-foreground underline underline-offset-4" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>. See our{" "}
                  <Link href="/terms" className="font-medium text-foreground underline underline-offset-4">
                    Website Terms
                  </Link>{" "}
                  for rules about using the site.
                </p>
              </LegalSection>
            </div>
          </section>
        </main>
      </LandingPageLayout>
    </>
  );
}
