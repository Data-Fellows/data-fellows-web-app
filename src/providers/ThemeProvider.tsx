import { ThemeContext } from "@/context/ThemeContext";
import { ReactNode, useState } from "react";

type Theme = { mode: "light" | "dark" | "system"; color: string };

export function ThemeProvider({
  children,
  defaultTheme = { mode: "dark", color: "yellow" },
}: {
  children: ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const toggleTheme = () => {
    setTheme((prev) => ({
      ...prev,
      mode: prev.mode === "dark" ? "light" : "dark",
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
