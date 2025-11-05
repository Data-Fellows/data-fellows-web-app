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
  return (
    <LandingPageLayout>
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
