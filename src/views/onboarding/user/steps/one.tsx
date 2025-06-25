import { getUser } from "@/helpers";
import { Briefcase, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";

const DataFellowIntro = ({
  setPage,
}: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [fullName, setFullName] = useState<string>("");

  useEffect(() => {
    const user = getUser();
    if (user) {
      setFullName(user.firstName || "there");
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-2 py-8 sm:px-4">
      <div className="w-full max-w-2xl rounded-xl bg-card shadow-lg p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Hey {fullName},</h1>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
          Ready to become a <span className="text-primary">Data Fellow</span>?
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 border-b border-border">
            <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              <User className="w-6 h-6" />
            </span>
            <p className="text-card-foreground text-base sm:text-lg font-medium">
              Answer a few questions and start building your profile
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
            onClick={() => setPage((page) => page + 1)}
          >
            Get started
          </button>
          <p className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
            It only takes 5-10 minutes and you can edit/finish later.
            <br className="hidden sm:block" />
            We&apos;ll save as you proceed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataFellowIntro;
