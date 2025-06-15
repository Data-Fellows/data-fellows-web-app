import Cookies from "js-cookie";

const THEME_COOKIE_KEY = "theme";
const TOKEN_COOKIE_KEY = "token";

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
