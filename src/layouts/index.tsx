import { useTheme } from "@/context/ThemeContext";
import React, { ReactNode } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useTheme();
    return (
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="fixed bottom-6 right-6 z-[100] max-sm:hidden rounded-full bg-primary text-primary-foreground shadow-lg p-4 hover:bg-primary/80 transition-colors"
        style={{ fontSize: 24, lineHeight: 0 }}
      >
        {theme.mode === "dark" ? <FaSun /> : <FaMoon />}
      </button>
    );
  };

  return (
    <div data-theme={theme.mode}>
      <main>
        {children}
        <ThemeToggleButton />
      </main>
    </div>
  );
};
export default Layout;
