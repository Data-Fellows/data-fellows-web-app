const THEME_STORAGE_KEY = "theme";
const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "user";
const USER_ROLE_STORAGE_KEY = "userRole";
const ENCRYPTION_KEY = "df-secure-key-2024";

function encrypt(text: string): string {
  if (typeof window === "undefined") return text;
  try {
    return btoa(encodeURIComponent(text));
  } catch {
    return text;
  }
}

function decrypt(encryptedText: string): string {
  if (typeof window === "undefined") return encryptedText;
  try {
    return decodeURIComponent(atob(encryptedText));
  } catch {
    return encryptedText;
  }
}

function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export type Theme = "light" | "dark";

export function getTheme(): Theme | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const encryptedValue =
      localStorage.getItem(THEME_STORAGE_KEY) ||
      sessionStorage.getItem(THEME_STORAGE_KEY);
    if (!encryptedValue) return undefined;

    const value = decrypt(encryptedValue);
    if (value === "dark" || value === "light") return value;
    return undefined;
  } catch {
    try {
      const encryptedValue = sessionStorage.getItem(THEME_STORAGE_KEY);
      if (!encryptedValue) return undefined;

      const value = decrypt(encryptedValue);
      if (value === "dark" || value === "light") return value;
      return undefined;
    } catch {
      return undefined;
    }
  }
}

export function setTheme(theme: Theme) {
  if (typeof window === "undefined") return;

  try {
    const encryptedTheme = encrypt(theme);
    localStorage.setItem(THEME_STORAGE_KEY, encryptedTheme);
  } catch {
    try {
      const encryptedTheme = encrypt(theme);
      sessionStorage.setItem(THEME_STORAGE_KEY, encryptedTheme);
    } catch {
      // Silent fail
    }
  }
}

export function getToken(): string | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const encryptedToken =
      localStorage.getItem(TOKEN_STORAGE_KEY) ||
      sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!encryptedToken) return undefined;

    return decrypt(encryptedToken);
  } catch {
    try {
      const encryptedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
      if (!encryptedToken) return undefined;

      return decrypt(encryptedToken);
    } catch {
      return undefined;
    }
  }
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;

  try {
    const encryptedToken = encrypt(token);
    localStorage.setItem(TOKEN_STORAGE_KEY, encryptedToken);
  } catch {
    try {
      const encryptedToken = encrypt(token);
      sessionStorage.setItem(TOKEN_STORAGE_KEY, encryptedToken);
    } catch {
      // Silent fail
    }
  }
}

export function removeToken() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Silent fail
  }
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
  if (typeof window === "undefined") return;

  try {
    const serializedUser = JSON.stringify(user);
    const encryptedUser = encrypt(serializedUser);

    try {
      localStorage.setItem(USER_STORAGE_KEY, encryptedUser);
    } catch {
      try {
        sessionStorage.setItem(USER_STORAGE_KEY, encryptedUser);
      } catch {
        // Silent fail
      }
    }
  } catch {
    // Silent fail
  }
}

export function getUser(): BasicUserData | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    let encryptedUserData = localStorage.getItem(USER_STORAGE_KEY);

    if (!encryptedUserData) {
      encryptedUserData = sessionStorage.getItem(USER_STORAGE_KEY);
    }

    if (!encryptedUserData) return undefined;

    const decryptedData = decrypt(encryptedUserData);

    if (!isValidJSON(decryptedData)) return undefined;

    return JSON.parse(decryptedData);
  } catch {
    return undefined;
  }
}

export function removeUser() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    // Silent fail
  }
}

export function setUserRole(role: string) {
  if (typeof window === "undefined") return;

  try {
    const encryptedRole = encrypt(role);
    localStorage.setItem(USER_ROLE_STORAGE_KEY, encryptedRole);
  } catch {
    try {
      const encryptedRole = encrypt(role);
      sessionStorage.setItem(USER_ROLE_STORAGE_KEY, encryptedRole);
    } catch {
      // Silent fail
    }
  }
}

export function getUserRole(): string | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const encryptedRole =
      localStorage.getItem(USER_ROLE_STORAGE_KEY) ||
      sessionStorage.getItem(USER_ROLE_STORAGE_KEY);
    if (!encryptedRole) return undefined;

    return decrypt(encryptedRole);
  } catch {
    try {
      const encryptedRole = sessionStorage.getItem(USER_ROLE_STORAGE_KEY);
      if (!encryptedRole) return undefined;

      return decrypt(encryptedRole);
    } catch {
      return undefined;
    }
  }
}

export function removeUserRole() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(USER_ROLE_STORAGE_KEY);
    sessionStorage.removeItem(USER_ROLE_STORAGE_KEY);
  } catch {
    // Silent fail
  }
}

export function clearStorage() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(USER_ROLE_STORAGE_KEY);

    sessionStorage.removeItem(THEME_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(USER_ROLE_STORAGE_KEY);
  } catch {
    // Silent fail
  }
}

export function clearCookies() {
  clearStorage();
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
