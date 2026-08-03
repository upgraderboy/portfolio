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
import Terminal from "./components/terminal/Terminal.tsx";
import BlogsSection from "./components/blogs/BlogsSection.tsx";
import BlogsPage from "./components/blogs/BlogsPage.tsx";
import BlogPostPage from "./components/blogs/BlogPostPage.tsx";
import ProjectsPage from "./components/portfolio/ProjectsPage.tsx";
import MemoriesPage from "./components/memories/MemoriesPage.tsx";
import { PortfolioProvider, usePortfolioData } from "./components/db/PortfolioContext.tsx";

interface PortfolioContentProps {
  navigate: (to: string) => void;
}

const PortfolioContent: React.FC<PortfolioContentProps> = ({ navigate }) => {
  return (
    <>
      <Header />
      <Home />
      <Terminal />
      <About />
      <Skills />
      <Services />
      <Qualification />
      <Memories navigate={navigate} />
      <Project navigate={navigate} />
      <BlogsSection navigate={navigate} />
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

  const renderContent = () => {
    if (route === "/admin") {
      return <Admin navigate={navigate} />;
    }
    if (route === "/blogs") {
      return <BlogsPage navigate={navigate} />;
    }
    if (route.startsWith("/blogs/")) {
      const blogId = route.substring("/blogs/".length);
      return <BlogPostPage blogId={blogId} navigate={navigate} />;
    }
    if (route === "/projects") {
      return <ProjectsPage navigate={navigate} />;
    }
    if (route === "/memories") {
      return <MemoriesPage navigate={navigate} />;
    }
    return <PortfolioContent navigate={navigate} />;
  };

  return (
    <>
      {renderContent()}
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