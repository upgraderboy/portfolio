import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import About from "./components/about/About.tsx";
import Contact from "./components/contact/Contact.tsx";
import Footer from "./components/footer/Footer.tsx";
import GlobalStyle from "./components/GlobalStyle.ts";
import Header from "./components/header/Header.tsx";
import Home from "./components/home/Home.tsx";
import Project from "./components/portfolio/Project.tsx";
import Qualification from "./components/qualification/Qualification.tsx";
import Memories from "./components/memories/Memories.tsx";
import Services from "./components/services/Services.tsx";
import Skills from "./components/skills/Skills.tsx";
import Testimonials from "./components/testimonials/Testimonials.tsx";
import Admin from "./components/admin/Admin.tsx";
import { PortfolioProvider, usePortfolioData } from "./components/db/PortfolioContext.tsx";

const PortfolioContent: React.FC<{ navigate: (to: string) => void }> = ({ navigate }) => {
  return (
    <>
      <Header />
      <Home />
      <About />
      <Skills />
      <Services />
      <Qualification />
      <Memories />
      <Project />
      <Testimonials />
      <Contact />
      <Footer navigate={navigate} />
    </>
  );
};

const AppContent: React.FC = () => {
  const [route, setRoute] = useState(window.location.pathname);
  const { isLoading } = usePortfolioData();

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setRoute(to);
  };

  if (isLoading) {
    return (
      <div className="portfolio-loader-container">
        <div className="portfolio-loader">
          <div className="portfolio-loader-circle"></div>
          <div className="portfolio-loader-text">Loading dynamic portfolio content...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {route === "/admin" ? (
        <Admin navigate={navigate} />
      ) : (
        <PortfolioContent navigate={navigate} />
      )}
    </>
  );
};

const App = () => {
  return (
    <PortfolioProvider>
      <Toaster />
      <GlobalStyle />
      <AppContent />
    </PortfolioProvider>
  );
};

export default App;