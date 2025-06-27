import Cookies from "js-cookie";

const THEME_COOKIE_KEY = "theme";
const TOKEN_COOKIE_KEY = "token";
const USER_COOKIE_KEY = "user";
const USER_ROLE_KEY = "userRole";

export type Theme = "light" | "dark";

export function getThemeCookie(): Theme | undefined {
  const value = Cookies.get(THEME_COOKIE_KEY);
  if (value === "dark" || value === "light") return value;
  return undefined;
}

export function setThemeCookie(theme: Theme) {
  Cookies.set(THEME_COOKIE_KEY, theme, { expires: 365 });
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_COOKIE_KEY);
}

export function setToken(token: string) {
  Cookies.set(TOKEN_COOKIE_KEY, token, { expires: 365 });
}

export function removeToken() {
  Cookies.remove(TOKEN_COOKIE_KEY);
}

export interface BasicUserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  photoUrl?: string;
  companyLogo?: string;
  companyName?: string;
  onboarded?: boolean;
  skillsAdded?: boolean;
  workExperienceAdded?: boolean;
  educationHistoryAdded?: boolean;
  bioAdded?: boolean;
  categoriesAndSpecialitiesAdded?: boolean;
  [key: string]: any;
}

export function setUser(user: BasicUserData) {
  Cookies.set(USER_COOKIE_KEY, JSON.stringify(user), { expires: 365 });
}

export function getUser(): BasicUserData | undefined {
  const user = Cookies.get(USER_COOKIE_KEY);
  if (!user) return undefined;
  try {
    return JSON.parse(user);
  } catch {
    return undefined;
  }
}

export function removeUser() {
  Cookies.remove(USER_COOKIE_KEY);
}

export function setUserRole(role: string) {
  Cookies.set(USER_ROLE_KEY, role, { expires: 365 });
}

export function getUserRole(): string | undefined {
  return Cookies.get(USER_ROLE_KEY);
}

export function removeUserRole() {
  Cookies.remove(USER_ROLE_KEY);
}

export function clearCookies() {
  Cookies.remove(THEME_COOKIE_KEY);
  Cookies.remove(TOKEN_COOKIE_KEY);
  Cookies.remove(USER_COOKIE_KEY);
  Cookies.remove(USER_ROLE_KEY);
}

export function isUserFullyOnboarded(user: BasicUserData | undefined): boolean {
  if (!user) return false;

  if (user.userType === "user") {
    return !!(
      user.onboarded &&
      user.skillsAdded &&
      user.workExperienceAdded &&
      user.educationHistoryAdded &&
      user.bioAdded &&
      user.onboarded
    );
  } else if (user.userType === "employer") {
    return !!user.onboarded;
  }

  return false;
}

export function getNextIncompleteOnboardingStep(
  user: BasicUserData | undefined
): number {
  if (!user || user.userType !== "user") return 0;

  return 0;
}

export function getActualNextStep(user: BasicUserData | undefined): number {
  if (!user || user.userType !== "user") return 1;

  if (!user.skillsAdded) return 1;

  if (!user.workExperienceAdded) return 2;

  if (!user.educationHistoryAdded) return 3;

  if (!user.bioAdded) return 4;

  if (!user.onboarded) return 5;

  return 5;
}

export function getOnboardingProgress(user: BasicUserData | undefined): {
  percentage: number;
  completedSteps: number;
  totalSteps: number;
} {
  if (!user || user.userType !== "user") {
    return { percentage: 0, completedSteps: 0, totalSteps: 5 };
  }

  const steps = [
    user.skillsAdded,
    user.workExperienceAdded,
    user.educationHistoryAdded,
    user.bioAdded,
    user.categoriesAndSpecialitiesAdded,
  ];

  const completedSteps = steps.filter(Boolean).length;
  const totalSteps = steps.length;
  const percentage = Math.round((completedSteps / totalSteps) * 100);

  return { percentage, completedSteps, totalSteps };
}

export function shouldRedirectToOnboarding(
  user: BasicUserData | undefined
): boolean {
  if (!user) return false;

  return user.userType === "user" && !isUserFullyOnboarded(user);
}
