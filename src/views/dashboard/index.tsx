import { BasicUserData, getUser, removeToken, removeUser } from "@/helpers";
import DashboardLayout from "@/layouts/dashboard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [user, setUser] = useState<BasicUserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = getUser();
    if (!userData) {
      router.replace("/auth/sign-in");
    } else {
      setUser(userData);
    }
  }, [router]);

  const handleLogout = () => {
    removeToken();
    removeUser();
    router.replace("/auth/sign-in");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className=" bg-background text-foreground flex flex-col items-center justify-center">
        <div className="bg-muted rounded-lg shadow p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">
            Welcome, {user.firstName}!
          </h1>
          <div className="mb-4">
            <div>
              <span className="font-semibold">Name:</span> {user.firstName}{" "}
              {user.lastName}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-semibold">User Type:</span> {user.userType}
            </div>
            {user.companyName && (
              <div>
                <span className="font-semibold">Company:</span>{" "}
                {user.companyName}
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-md bg-primary text-primary-foreground py-3 font-semibold text-lg transition hover:bg-primary/90"
          >
            Logout
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
