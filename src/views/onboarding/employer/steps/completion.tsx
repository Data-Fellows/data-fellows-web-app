import { useRouter } from "next/router";
import { useEffect } from "react";

interface CompletionStepProps {
  setPage: (page: number) => void;
}

export default function CompletionStep({ setPage }: CompletionStepProps) {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const goToDashboard = () => {
    router.push("/dashboard/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-center p-8 lg:p-12">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
          <svg
            className="h-12 w-12 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Onboarding Complete! 🎉
        </h1>

        <p className="text-lg text-muted-foreground mb-8">
          Congratulations! You've successfully completed the employer onboarding
          process. Your company profile is set up and BizPilot has analyzed your
          business needs.
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-4 p-4 bg-muted/30 border border-border rounded-xl">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-1">
                Ready to Post Jobs
              </h3>
              <p className="text-sm text-muted-foreground">
                Your company profile is complete and ready to attract top data
                talent.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-muted/30 border border-border rounded-xl">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-1">
                Business Insights
              </h3>
              <p className="text-sm text-muted-foreground">
                BizPilot has identified opportunities and solutions for your
                business.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={goToDashboard}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
        >
          Go to Dashboard
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        {/* Auto-redirect message */}
        <p className="text-sm text-muted-foreground mt-4">
          You'll be automatically redirected to your dashboard in a few seconds.
        </p>
      </div>
    </div>
  );
}
