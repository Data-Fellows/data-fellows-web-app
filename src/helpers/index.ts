import Cookies from "js-cookie";

const THEME_COOKIE_KEY = "theme";
export type Theme = "light" | "dark";

export function getThemeCookie(): Theme | undefined {
  const value = Cookies.get(THEME_COOKIE_KEY);
  if (value === "dark" || value === "light") return value;
  return undefined;
}

export function setThemeCookie(theme: Theme) {
  Cookies.set(THEME_COOKIE_KEY, theme, { expires: 365 });
}
