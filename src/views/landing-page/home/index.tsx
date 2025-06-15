import LandingPageLayout from "@/layouts/landing-page";
import React from "react";
import About from "./sections/about";
import ContactUs from "./sections/contact-us";
import Hero from "./sections/hero";
import HeroTwo from "./sections/hero-two";
import Partners from "./sections/partners";
import Services from "./sections/services";
import Testimonials from "./sections/testimonials";

const Home: React.FC = () => {
  return (
    <LandingPageLayout>
      <Hero />
      <About />
      <Services />
      <Testimonials />
      <HeroTwo />
      <ContactUs />
      <Partners />
    </LandingPageLayout>
  );
};

export default Home;
