import LandingPageLayout from "@/layouts/landing-page";
import Image from "next/image";
import JoinSection from "../home/sections/join";

const JoinPage = () => {
  return (
    <LandingPageLayout>
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4" aria-labelledby="join-hero-heading">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-primary/10 bg-secondary/40">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="space-y-6 px-6 py-12 lg:col-span-6 lg:px-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  Join Data Fellows
                </span>
                <h1
                  id="join-hero-heading"
                  className="text-3xl font-semibold text-foreground sm:text-4xl"
                >
                  You belong in a community that ships real outcomes.
                </h1>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Tell us a little about yourself and we&apos;ll connect you to
                  a path -- mentorship, product squads, or partnerships -- that
                  matches where you want to grow next.
                </p>
              </div>
              <div className="relative h-full w-full lg:col-span-6">
                <div className="relative h-full min-h-[300px]">
                  <Image
                    src="/images/data-community-hero.jpg"
                    alt="Data Fellows members collaborating"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <JoinSection />
      </div>
    </LandingPageLayout>
  );
};

export default JoinPage;


