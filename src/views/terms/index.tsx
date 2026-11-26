import LegalSection from "@/components/custom/legal-section";
import PageSeo from "@/components/seo/page-seo";
import { site } from "@/constants/site";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";

const LAST_UPDATED = "November 26, 2026";

export default function TermsAndConditions() {
  return (
    <>
      <PageSeo
        title="Website Terms | Data Fellows"
        description="Terms for using the Data Fellows website, public activities and community content."
        path="/terms"
      />
      <LandingPageLayout>
        <main className="min-h-screen bg-background pt-28 md:pt-32">
          <section className="px-4 py-12 sm:px-6">
            <div className="mx-auto max-w-4xl space-y-4 text-center">
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Website Terms
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                These terms explain the basic rules for using the Data Fellows website.
              </p>
              <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                Last updated: {LAST_UPDATED}
              </p>
            </div>
          </section>

          <section className="px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-4xl space-y-8">
              <LegalSection title="1. Who these terms cover">
                <p>
                  Data Fellows Inc. operates this website. These terms apply to the public website at {site.url}, including its articles, project pages, public activities and forms. They do not replace rules set by an external platform or a separate written agreement.
                </p>
                <p>
                  The Studio workspace at studio.datafellowsai.com is a separate service. Any terms shown there, and any signed project agreement, apply to use of that workspace or paid work. If a project agreement conflicts with these website terms, the project agreement governs that work.
                </p>
              </LegalSection>

              <LegalSection title="2. The website and community">
                <p>
                  The website shares information about Data Fellows, its community, learning activities, technology work and published resources. Programs and activities can change, pause or close; details on the relevant page apply to that opportunity.
                </p>
                <p>
                  Joining the community does not make a member an employee, contractor or representative of Data Fellows. It does not guarantee a scholarship, mentorship, job, project assignment or other opportunity. Any paid contribution or other formal role must be agreed separately.
                </p>
              </LegalSection>

              <LegalSection title="3. Forms, bookings and registrations">
                <p>
                  Please provide accurate information when you contact us, book a session or register for an activity. A message or booking request does not create a contract or require either side to proceed with a project.
                </p>
                <p>
                  Registration is for the activity shown on the page. A registration does not guarantee a place unless the activity confirms it. Event details may change; we will use the contact information you provide for activity-related updates.
                </p>
                <p>
                  Forms and schedulers may be hosted by third-party providers. Their services are also subject to their own terms and privacy notices. See our{" "}
                  <Link href="/privacy" className="font-medium text-foreground underline underline-offset-4">
                    Privacy Notice
                  </Link>{" "}
                  for how information submitted through this website is handled.
                </p>
              </LegalSection>

              <LegalSection title="4. Public challenge contributions">
                <p>
                  Some learning challenges let you submit a name and an optional note about what you learned. The challenge page displays the name and note on its public wall. Do not include passwords, sensitive personal details, confidential information or information about someone else unless you have permission to share it.
                </p>
                <p>
                  You keep any rights you have in what you submit. By sending a contribution for a challenge wall, you allow Data Fellows to display it there as part of that activity. You can contact us if you want us to review or remove a contribution.
                </p>
              </LegalSection>

              <LegalSection title="5. Data Fellows Studio and project work">
                <p>
                  A conversation with the Studio does not start a project or set its price, scope, delivery date or ownership terms. Those details, including responsibilities and payment, must be set out in a separate written agreement before project work begins.
                </p>
                <p>
                  Community members are not an on-demand workforce. A member may take part in project work only through a separately agreed role and terms.
                </p>
              </LegalSection>

              <LegalSection title="6. Website content and intellectual property">
                <p>
                  Data Fellows or its licensors own the website design, Data Fellows-authored copy, brand assets and other material identified as Data Fellows content. You may view and share links for personal, non-commercial use. Do not copy or republish substantial portions without permission.
                </p>
                <p>
                  Project pages identify work by Data Fellows, collaborators or individual contributors. Attribution does not transfer ownership to Data Fellows. Rights in commissioned project work are set out in the relevant project agreement.
                </p>
              </LegalSection>

              <LegalSection title="7. Acceptable use">
                <p>
                  Do not use the website unlawfully, interfere with its operation, try to access restricted systems or information, impersonate someone else, or submit fraudulent, harmful or abusive material. We may restrict access where needed to protect the website, its users or our systems.
                </p>
              </LegalSection>

              <LegalSection title="8. External services and links">
                <p>
                  The website links to services run by others, including community platforms, event tools, learning providers, social networks and the Studio workspace. Those services set their own terms and privacy practices. Data Fellows is not responsible for how an external service operates.
                </p>
              </LegalSection>

              <LegalSection title="9. Availability and liability">
                <p>
                  We work to keep the website available and information accurate, but we cannot promise uninterrupted access or that every page will always be current. Website content is general information, not professional, financial or legal advice.
                </p>
                <p>
                  To the extent permitted by law, Data Fellows is not responsible for indirect or consequential loss arising from use of the website. Nothing in these terms limits a right or liability that cannot be limited under applicable law.
                </p>
              </LegalSection>

              <LegalSection title="10. Changes to these terms">
                <p>
                  We may revise these terms as the website and its activities change. The date above shows when this page was last updated. The terms in force when you use the website apply to that use.
                </p>
              </LegalSection>

              <LegalSection title="11. Governing law and contact">
                <p>
                  These terms are governed by the laws of Ontario and the applicable laws of Canada. Any mandatory rights you have under the law where you live remain in effect.
                </p>
                <p>
                  Questions about these terms? Email{" "}
                  <a className="font-medium text-foreground underline underline-offset-4" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>.
                </p>
              </LegalSection>
            </div>
          </section>
        </main>
      </LandingPageLayout>
    </>
  );
}
