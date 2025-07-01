import { getUser } from "@/helpers";
import { useMemo } from "react";
import EmployerDashboard from "./employer/home";
import UserDashboard from "./user/home";

interface User {
  id?: string;
  _id?: string;
  userType: "employer" | "user" | string;
  [key: string]: any;
}

type UserRole = "employer" | "user";

function getUserRole(user: User | null): UserRole | null {
  if (!user) return null;

  if (user.userType === "employer") {
    return "employer";
  }

  return "user";
}

export default function Dashboard() {
  const user = useMemo(() => getUser() as User | null, []);
  const userRole = useMemo(() => getUserRole(user), [user]);

  if (!user || !userRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="text-muted-foreground text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  console.log("Dashboard rendering for user:", {
    userType: user.userType,
    role: userRole,
    userId: user.id || user._id,
  });

  if (userRole === "employer") {
    return <EmployerDashboard />;
  }

  return <UserDashboard />;
}
