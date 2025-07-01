import { getUser } from "@/helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Import the specific problem views
import EmployerProblemsPage from "./employer/problems";
import UserProblemsPage from "./user/problems";

export default function ProblemsPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getUser();

    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    setUserType(user.userType);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="text-muted-foreground text-sm">Loading problems...</p>
        </div>
      </div>
    );
  }

  // Route to appropriate problems view based on user type
  if (userType === "employer") {
    return <EmployerProblemsPage />;
  } else {
    return <UserProblemsPage />;
  }
}
