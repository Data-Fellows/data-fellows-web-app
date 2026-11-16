import { useTheme } from "@/stores/context/ThemeContext";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

interface LayoutProps {
  children: ReactNode;
}

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const isDashboard = router.pathname.startsWith("/dashboard");

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`fixed bottom-6 right-6 z-[100] ${
        isDashboard ? "md:inline-block hidden" : ""
      } rounded-full bg-primary text-primary-foreground shadow-lg p-4 hover:bg-primary/80 transition-colors`}
      style={{ fontSize: 24, lineHeight: 0 }}
    >
      {theme.mode === "dark" ? <FaSun /> : <FaMoon />}
    </button>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const router = useRouter();

  if (router.pathname.startsWith("/dashboard")) {
    return (
      <div data-theme={theme.mode}>
        <ThemeToggleButton />
      </div>
    );
  }
  return (
    <div data-theme={theme.mode}>
      {/* Not a <main> here -- each page's own layout (e.g. LandingPageLayout)
          already renders the real <main> landmark; wrapping it in a second
          one produced invalid nested <main><main>...</main></main> markup
          that confuses screen-reader landmark navigation. */}
      {children}
      <ThemeToggleButton />
    </div>
  );
};

export default Layout;
