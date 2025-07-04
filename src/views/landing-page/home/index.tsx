import LandingPageLayout from "@/layouts/landing-page";
import React from "react";
import About from "./sections/about";
import ContactUs from "./sections/contact-us";
import Hero from "./sections/hero";
import HeroTwo from "./sections/hero-two";
import Partners from "./sections/partners";
import Services from "./sections/services";
import Testimonials from "./sections/testimonials";
import BizpilotLandingDemo from "@/services/bizpilot/BizpilotLandingDemo";
import { useRouter } from "next/router";

const Home: React.FC = () => {
  const router = useRouter();

  const handleSignUpClick = (userType: 'data-professional' | 'business-owner') => {
    // Navigate to sign-up page with user type
    router.push({
      pathname: '/auth/sign-up',
      query: { type: userType === 'business-owner' ? 'employer' : 'user' }
    });
  };

  return (
    <LandingPageLayout>
      <Hero />
      <About />
      <Services />
      <Testimonials />
      <HeroTwo />
      <ContactUs />
      <Partners />
      
      {/* BizPilot Demo - Floating button that appears on all sections */}
      <BizpilotLandingDemo onSignUpClick={handleSignUpClick} />
    </LandingPageLayout>
  );
};

export default Home;
