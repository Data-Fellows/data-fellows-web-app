import ImpactReportAnnouncement from "@/components/custom/impact-report-announcement";
import PageSeo from "@/components/seo/page-seo";
import LandingPageLayout from "@/layouts/landing-page";
import React from "react";
import About from "./sections/about";
import Community from "./sections/community";
import Hero from "./sections/hero";
import Partners from "./sections/partners";
import Products from "./sections/products";
import Resources from "./sections/resources";
import WhoWeAre from "./sections/who-we-are";

const Home: React.FC = () => {
  console.log("home")
  return (
    <LandingPageLayout>
      <PageSeo
        title="Data Fellows -- Turning Data Into Clarity"
        description="We train, build, and launch tools that make data feel human -- for individuals and businesses across 33+ countries. Join our community of data fellows."
        path="/"
      />
      <ImpactReportAnnouncement />
      <div className="space-y-24 md:space-y-28">
        <Hero />
        <WhoWeAre />
        <Products />
        <Community />
        <Partners />
        <Resources />
        <About />
      </div>
    </LandingPageLayout>
  );
};

export default Home;
