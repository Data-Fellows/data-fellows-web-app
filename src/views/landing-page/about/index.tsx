import LandingPageLayout from "@/layouts/landing-page";
import React from "react";
import About from "../home/sections/about";
import OurTeam from "./sections/our-team";

const AboutUs: React.FC = () => {
  return (
    <LandingPageLayout>
      <div className="pt-20">
        <About />
        <OurTeam />
      </div>
    </LandingPageLayout>
  );
};

export default AboutUs;
