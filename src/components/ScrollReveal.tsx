"use client";

import { useEffect } from "react";

const ScrollReveal = () => {
  useEffect(() => {
    const revealElements = () => {
      const reveals = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-scale"
      );
      const windowHeight = window.innerHeight;

      reveals.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 120;

        if (elementTop < windowHeight - revealPoint) {
          el.classList.add("active");
        }
      });
    };

    // Animate skill bars when they come into view
    const animateSkillBars = () => {
      const skillBars = document.querySelectorAll(".skill__progress");
      const windowHeight = window.innerHeight;

      skillBars.forEach((bar) => {
        const elementTop = bar.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
          const width = bar.getAttribute("data-width");
          if (width && !(bar as HTMLElement).style.width) {
            (bar as HTMLElement).style.width = width;
            bar.classList.add("animated");
          }
        }
      });
    };

    // Run on load
    revealElements();
    animateSkillBars();

    window.addEventListener("scroll", revealElements);
    window.addEventListener("scroll", animateSkillBars);

    return () => {
      window.removeEventListener("scroll", revealElements);
      window.removeEventListener("scroll", animateSkillBars);
    };
  }, []);

  return null;
};

export default ScrollReveal;

