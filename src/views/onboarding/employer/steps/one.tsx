import { getEmployerOnboardingProgress, getUser } from "@/helpers";
import { Building2, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";

const EmployerIntro = ({
  setPage,
}: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [companyName, setCompanyName] = useState<string>("");
  const [progress, setProgress] = useState({
    percentage: 0,
    completedSteps: 0,
    totalSteps: 2,
  });
  const [nextStep, setNextStep] = useState(1);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setCompanyName(user.companyName || "there");
      const userProgress = getEmployerOnboardingProgress(user);
      setProgress(userProgress);
      // Always go to step 1 (company setup) from the intro
      setNextStep(1);
      setIsReturning(userProgress.completedSteps > 0);
    }
  }, []);

  const getStepName = (step: number) => {
    const stepNames = ["", "Company Setup", "Complete"];
    return stepNames[step] || "Next Step";
  };

  const getCompletedSteps = () => {
    const user = getUser();
    if (!user) return [];

    const completed = [];
    if (user.companyDetailsAdded) completed.push("Company Setup");
    return completed;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Welcome content */}
          <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                Employer Onboarding
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {isReturning ? `Welcome back!` : `Welcome to Data Fellows!`}
              </h1>

              <p className="text-lg text-muted-foreground mb-6">
                {isReturning
                  ? `Let's continue setting up your company profile to connect with talented data professionals.`
                  : `We're excited to help you connect with talented data professionals. Let's set up your company profile to get started.`}
              </p>

              {isReturning && (
                <div className="bg-muted/30 border border-border rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">
                      Your Progress
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {progress.completedSteps} of {progress.totalSteps} steps
                    </span>
                  </div>

                  <div className="w-full bg-muted rounded-full h-3 mb-4">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>Next:</strong> {getStepName(nextStep)}
                    </p>
                    {getCompletedSteps().length > 0 && (
                      <p className="text-sm text-green-600">
                        <strong>Completed:</strong>{" "}
                        {getCompletedSteps().join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3 p-4 bg-muted/30 border border-border rounded-xl">
                  <div className="bg-primary/20 p-2 rounded-lg flex-shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Company Profile
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Showcase your organization to attract top talent
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/30 border border-border rounded-xl">
                  <div className="bg-accent/20 p-2 rounded-lg flex-shrink-0">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Find Talent
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Connect with skilled data professionals
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setPage(nextStep)}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isReturning ? "Continue Setup" : "Get Started"}
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
            </div>
          </div>

          {/* Right side - Visual content */}
          <div className="lg:w-2/5 bg-gradient-to-br from-primary/10 to-accent/10 p-8 lg:p-12 flex flex-col justify-center items-center">
            <div className="relative">
              <div className="w-64 h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                <Building2 className="w-32 h-32 lg:w-40 lg:h-40 text-primary" />
              </div>

              <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-pulse">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div className="absolute -bottom-4 -left-4 bg-accent text-white p-3 rounded-full shadow-lg">
                <User className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Join Our Network
              </h3>
              <p className="text-muted-foreground">
                Connect with over 10,000+ data professionals ready to solve your
                challenges
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerIntro;
