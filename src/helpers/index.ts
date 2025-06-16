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
