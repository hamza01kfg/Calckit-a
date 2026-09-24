"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

const ThemeCtx = createContext<{
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
} | null>(null);

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("calckit-theme");
    let initial: Theme;
    if (saved === "dark" || saved === "light") {
      initial = saved;
    } else {
      initial = getSystemTheme();
    }
    setThemeState(initial);
    document.documentElement.setAttribute("data-theme", initial);

    // Follow OS changes only when user has not explicitly chosen
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      const explicit = localStorage.getItem("calckit-theme");
      if (explicit === "dark" || explicit === "light") return;
      const next: Theme = e.matches ? "dark" : "light";
      setThemeState(next);
      document.documentElement.setAttribute("data-theme", next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = (next: Theme) => {
    localStorage.setItem("calckit-theme", next);
    document.documentElement.setAttribute("data-theme", next);
    setThemeState(next);
  };

  const toggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeCtx.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) {
    return {
      theme: "light" as Theme,
      toggle: () => {},
      setTheme: (_t: Theme) => {},
    };
  }
  return ctx;
}
