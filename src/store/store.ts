"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
interface ToggleTheme {
  isDarkMode: "light" | "dark";
  toggleTheme: () => void;
}

const useThemeStore = create<ToggleTheme>()(
  persist(
    (set) => ({
      isDarkMode: "light",
      toggleTheme: () =>
        set((state) => {
          if (typeof document !== "undefined") {
            document
              .querySelector("body")
              ?.setAttribute("data-theme", state.isDarkMode);
          }
          return {
            isDarkMode: state.isDarkMode === "light" ? "dark" : "light",
          };
        }),
    }),
    { name: "theme", storage: createJSONStorage(() => sessionStorage) }
  )
);

interface ToggleNav {
  isOpen: boolean;
  toggleNav: () => void;
}
const useNavigationStore = create<ToggleNav>((set) => ({
  isOpen: false,
  toggleNav: () =>
    set((state) => {
      return { isOpen: !state.isOpen };
    }),
}));

const Store = { useThemeStore, useNavigationStore };
export default Store;

// isDarkMode: true,
