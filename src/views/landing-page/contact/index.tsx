import LandingPageLayout from "@/layouts/landing-page";
import React from "react";
import ContactUs from "../home/sections/contact-us";

const Contact: React.FC = () => {
  return (
    <LandingPageLayout>
      <ContactUs />
    </LandingPageLayout>
  );
};

export default Contact;
