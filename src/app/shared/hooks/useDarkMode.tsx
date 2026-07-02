import { useEffect } from "react";
import { usePrefersDarkMode } from "./usePrefersDarkMode";
import { useSafeLocalStorage } from "./useSafeLocalStorage";
export const useDarkModeClass = () => {
  const [isEnabled, setIsEnabled] = useSafeLocalStorage("dark-mode", undefined);
  const prefersDarkMode = usePrefersDarkMode();
  const enabled = isEnabled === undefined ? prefersDarkMode : isEnabled;

  useEffect(() => {
    if (window === undefined) return;
    const root = window.document.documentElement;
    root.classList.remove(enabled ? "light" : "dark");
    root.classList.add(enabled ? "dark" : "light");
  }, [enabled]);
  useEffect(() => {
    if (isEnabled === undefined) {
      console.log("🚀 ~ file: useDarkMode.tsx ~ line 17 ~ useEffect ~ isEnabled", isEnabled);
      setIsEnabled("false");
    }
  }, [isEnabled]);

  return [enabled, setIsEnabled];
};
