import ImpactReportAnnouncement from "@/components/custom/impact-report-announcement";
import PageSeo from "@/components/seo/page-seo";
import LandingPageLayout from "@/layouts/landing-page";
import React from "react";
import Community from "./sections/community";
import Cta from "./sections/cta";
import Hero from "./sections/hero";
import Impact from "./sections/impact";
import Partners from "./sections/partners";
import Pillars from "./sections/pillars";
import Resources from "./sections/resources";
import SelectedWork from "./sections/selected-work";
import WhoWeAre from "./sections/who-we-are";

const Home: React.FC = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title="Data Fellows | Building Technology Through Community"
        description="Data Fellows is a global, community-led technology organization connecting professionals, learners and builders across data, AI and software development."
        path="/"
      />
      <ImpactReportAnnouncement />
      <div className="space-y-24 md:space-y-28">
        <Hero />
        <Pillars />
        <WhoWeAre />
        <Community />
        <SelectedWork />
        <Impact />
        <Partners />
        <Resources />
        <Cta />
      </div>
    </LandingPageLayout>
  );
};

export default Home;
