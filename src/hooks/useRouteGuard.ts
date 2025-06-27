import { getUser, isUserFullyOnboarded } from "@/helpers";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useRouteGuard() {
  const router = useRouter();

  useEffect(() => {
    if (!router.pathname.startsWith("/dashboard")) return;

    const user = getUser();
    if (!user) return;

    if (
      user.userType === "user" &&
      !isUserFullyOnboarded(user) &&
      !router.pathname.startsWith("/onboarding/user")
    ) {
      router.replace("/onboarding/user");
      return;
    }
    if (
      user.userType === "employer" &&
      !isUserFullyOnboarded(user) &&
      !router.pathname.startsWith("/onboarding/employer")
    ) {
      router.replace("/onboarding/employer");
      return;
    }
  }, [router.pathname]);
}
