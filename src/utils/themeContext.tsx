import {
  createContext,
  useContext,
  useEffect,
  useState,
	useMemo,
  ReactNode,
} from "react";

export const themes = {
  default: "Default",
  halloween: "Halloween",
} as const;

export type Theme = keyof typeof themes;

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "default";
    }

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme && savedTheme in themes) {
      return savedTheme as Theme;
    }

    return "default";
  });
	
	useEffect(() => {
		if (theme === "default") {
			document.documentElement.removeAttribute("data-theme");
    } else {
			document.documentElement.setAttribute("data-theme", theme);
    }
		localStorage.setItem("theme", theme);
	}, [theme]);

	const contextValue = useMemo(
		() => ({ theme, setTheme }),
		[theme]
	);

	return (
		<ThemeContext.Provider value={contextValue}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
