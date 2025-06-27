import { getActualNextStep, getOnboardingProgress, getUser } from "@/helpers";
import { Briefcase, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";

const DataFellowIntro = ({
  setPage,
}: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [fullName, setFullName] = useState<string>("");
  const [progress, setProgress] = useState({
    percentage: 0,
    completedSteps: 0,
    totalSteps: 5,
  });
  const [nextStep, setNextStep] = useState(1);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setFullName(user.firstName || "there");
      const userProgress = getOnboardingProgress(user);
      setProgress(userProgress);
      setNextStep(getActualNextStep(user));
      setIsReturning(userProgress.completedSteps > 0);
    }
  }, []);

  const getStepName = (step: number) => {
    const stepNames = [
      "",
      "Skills",
      "Work Experience",
      "Education",
      "Bio",
      "Profile Details",
    ];
    return stepNames[step] || "Next Step";
  };

  const getCompletedSteps = () => {
    const user = getUser();
    if (!user) return [];

    const completed = [];
    if (user.skillsAdded) completed.push("Skills");
    if (user.workExperienceAdded) completed.push("Work Experience");
    if (user.educationHistoryAdded) completed.push("Education");
    if (user.bioAdded) completed.push("Bio");
    if (user.categoriesAndSpecialitiesAdded) completed.push("Profile Details");

    return completed;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-2 py-8 sm:px-4">
      <div className="w-full max-w-2xl rounded-xl bg-card shadow-lg p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {isReturning ? `Welcome back, ${fullName}!` : `Hey ${fullName},`}
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
          {isReturning ? (
            <>
              Let's continue building your{" "}
              <span className="text-primary">Data Fellows</span> profile
            </>
          ) : (
            <>
              Ready to become a{" "}
              <span className="text-primary">Data Fellow</span>?
            </>
          )}
        </h2>

        {isReturning && (
          <div className="mb-6 p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-primary">Your Progress</h3>
              <span className="text-sm text-primary font-medium">
                {progress.percentage}% Complete
              </span>
            </div>
            <div className="w-full bg-primary/20 rounded-full h-2 mb-3">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
            <div className="text-sm text-card-foreground">
              <p className="mb-2">
                ✅ <strong>Completed:</strong> {getCompletedSteps().join(", ")}
              </p>
              <p>
                🎯 <strong>Next:</strong> {getStepName(nextStep)}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 border-b border-border">
            <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              <User className="w-6 h-6" />
            </span>
            <p className="text-card-foreground text-base sm:text-lg font-medium">
              {isReturning
                ? "Complete your profile setup"
                : "Answer a few questions and start building your profile"}
            </p>
          </div>
          <div className="flex items-center space-x-3 p-4 border-b border-border">
            <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              <Briefcase className="w-6 h-6" />
            </span>
            <p className="text-card-foreground text-base sm:text-lg font-medium">
              Apply to job roles posted by business owners that match your
              profile and skills
            </p>
          </div>
          <div className="flex items-center space-x-3 p-4">
            <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <p className="text-card-foreground text-base sm:text-lg font-medium">
              Get secured jobs that offer good paid roles
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-10 items-center">
          <button
            className="w-full sm:w-1/2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-3 font-semibold text-base sm:text-lg transition disabled:opacity-60"
            onClick={() => setPage(nextStep)}
          >
            {isReturning ? "Continue" : "Get started"}
          </button>
          <p className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
            {isReturning ? (
              <>
                Pick up where you left off.
                <br className="hidden sm:block" />
                We&apos;ve saved your progress.
              </>
            ) : (
              <>
                It only takes 5-10 minutes and you can edit/finish later.
                <br className="hidden sm:block" />
                We&apos;ll save as you proceed.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataFellowIntro;
