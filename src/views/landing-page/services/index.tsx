import LandingPageLayout from "@/layouts/landing-page";
import React from "react";
import Services from "../home/sections/services";

const ServicesPage: React.FC = () => {
  return (
    <LandingPageLayout>
      <div className="md:pt-20">
        <Services />
        <div className="relative z-10 mx-auto my-20 max-w-[80%] px-4">
          <h3 className="mb-4 text-center text-2xl font-bold text-primary">
            🎥 How to Navigate the Website
          </h3>
          <p className="mb-6 text-center text-muted-foreground">
            Watch this short Loom video for a walkthrough of the Data Fellows
            website and its features.
          </p>
          <div className="flex justify-center">
            <div className="relative aspect-video w-full">
              <iframe
                src="https://www.loom.com/embed/493fa3cf3b584e95be580f3f09586101"
                frameBorder="0"
                allowFullScreen
                className="absolute left-0 top-0 h-full w-full rounded-xl"
                title="How to Navigate Data Fellows Website"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </LandingPageLayout>
  );
};

export default ServicesPage;
