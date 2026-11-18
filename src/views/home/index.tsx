import ImpactReportAnnouncement from "@/components/custom/impact-report-announcement";
import PageSeo from "@/components/seo/page-seo";
import LandingPageLayout from "@/layouts/landing-page";
import React from "react";
import Community from "./sections/community";
import Cta from "./sections/cta";
import Hero from "./sections/hero";
import Impact from "./sections/impact";
import Partners from "./sections/partners";
import Products from "./sections/products";
import Resources from "./sections/resources";
import SelectedWork from "./sections/selected-work";
import StudioCredibility from "./sections/studio-credibility";
import WhoWeAre from "./sections/who-we-are";

const Home: React.FC = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title="Data Fellows | Independent Automation Studio"
        description="Data Fellows is an independent automation studio helping organizations solve recurring operational challenges through software, data and AI, starting with healthcare and insurance."
        path="/"
      />
      <ImpactReportAnnouncement />
      <div className="space-y-24 md:space-y-28">
        <Hero />
        <StudioCredibility />
        <WhoWeAre />
        <Impact />
        <SelectedWork />
        <Products />
        <Community />
        <Partners />
        <Resources />
        <Cta />
      </div>
    </LandingPageLayout>
  );
};

export default Home;
