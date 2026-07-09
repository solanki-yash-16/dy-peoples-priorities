"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-[104px]" />; // Placeholder to prevent layout shift
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-input bg-background p-1 shadow-sm">
      <button
        onClick={() => setTheme("light")}
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${theme === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
        title="Light Mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${theme === "system" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
        title="System Default"
      >
        <Monitor className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${theme === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
        title="Dark Mode"
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}
