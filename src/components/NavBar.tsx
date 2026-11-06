"use client";
import { Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import NavigationLinks from "./NavigationLinks";
import Icon from "./Icon";
import Store from "@/store/store";

const NavBar = () => {
  const { isDarkMode, toggleTheme } = Store.useThemeStore();
  const { toggleNav } = Store.useNavigationStore();
  useEffect(() => {
    if (typeof document !== "undefined"){
        if (isDarkMode === "light")
            document.querySelector("body")?.setAttribute("data-theme", "light");
          else document.querySelector("body")?.setAttribute("data-theme", "dark");
    }
  }, [isDarkMode]);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      id="navbar"
      className={isScrolled ? "flex__center drop" : "flex__center"}
    >
      <div className="logo">
        <Icon name="logo" width={100} height={100} />
      </div>
      <NavigationLinks name="route" />
      <div className="flex__center">
        <label htmlFor="theme-checkbox" className="theme__toggle">
          <div className="icon__container">
            {isDarkMode === "dark" ? (
              <Sun onClick={() => toggleTheme()} />
            ) : (
              <Moon onClick={() => toggleTheme()} />
            )}
          </div>
        </label>
        <div className="icon__container menu__btn" id="menu__btn">
          <Menu onClick={() => toggleNav()} />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
