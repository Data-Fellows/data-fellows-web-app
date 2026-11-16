import LandingPageLayout from "@/layouts/landing-page";
import Image from "next/image";

export default function NotFound() {

  const Content = (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-background text-foreground">
      <div className={`w-full flex flex-col items-center text-center`}>
        <div className="mb-[-40px] sm:mb-0 flex justify-center w-full">
          <Image
            src="/svgs/landing-page/not-found.svg"
            alt="404 Error - Page Not Found"
            width={600}
            height={300}
            priority
            className="w-full h-auto max-w-[400px] sm:max-w-[600px] mx-auto"
          />
        </div>
        <div className="font-display text-3xl sm:text-5xl mt-[60px] sm:mt-[-60px] font-bold tracking-tight text-foreground">
          Oops...
        </div>
        <p className="text-base sm:text-lg mb-6 sm:mb-8 text-muted-foreground">
          This page does not exist or was removed!
        </p>
      </div>
    </div>
  );

  return <LandingPageLayout>{Content}</LandingPageLayout>
}
