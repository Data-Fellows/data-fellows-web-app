import DashboardLayout from "@/layouts/dashboard";
import LandingPageLayout from "@/layouts/landing-page";
import Image from "next/image";
import { useRouter } from "next/router";

export default function NotFound() {
  const router = useRouter();
  const isDashboard = router.asPath.startsWith("/dashboard");

  const Content = (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-background text-foreground">
      <div
        className={`w-full ${
          isDashboard ? "md:-ml-64" : "`"
        } flex flex-col items-center text-center`}
      >
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
        <div className="text-3xl sm:text-5xl mt-[60px] sm:mt-[-60px] font-bold text-primary">
          Oops...
        </div>
        <p className="text-base sm:text-lg mb-6 sm:mb-8 text-muted-foreground">
          This page does not exist or was removed!
        </p>
      </div>
    </div>
  );

  return isDashboard ? (
    <DashboardLayout>{Content}</DashboardLayout>
  ) : (
    <LandingPageLayout>{Content}</LandingPageLayout>
  );
}
