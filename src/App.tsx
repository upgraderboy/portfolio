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
import ResourcesPage from "./components/resources/ResourcesPage.tsx";
import { PortfolioProvider, usePortfolioData } from "./components/db/PortfolioContext.tsx";

interface PortfolioContentProps {
  navigate: (to: string) => void;
}

const PortfolioContent: React.FC<PortfolioContentProps> = ({ navigate }) => {
  return (
    <>
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

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const { portfolioData } = usePortfolioData();

  useEffect(() => {
    const seo = portfolioData.seo;
    if (!seo) return;

    let activeTitle = seo.siteTitle;
    let activeDescription = seo.siteDescription;

    // Check if current route matches one of the sub-routes configured in SEO Sitelinks
    const currentRoute = seo.routes.find((r) => r.path === route || (r.path !== "/" && route.startsWith(r.path)));
    if (currentRoute) {
      activeTitle = `${currentRoute.title} | ${seo.siteTitle}`;
      activeDescription = currentRoute.description;
    }

    // Special handler for dynamic blog post articles
    if (route.startsWith("/blogs/") && route.length > 7) {
      const blogId = route.substring(7);
      const blog = (portfolioData.blogs || []).find((b) => b.id === blogId);
      if (blog) {
        activeTitle = `${blog.title} | ${seo.siteTitle}`;
        // Simple HTML tag removal helper for clean meta description previews
        const plainText = blog.content.replace(/<[^>]*>/g, "").substring(0, 150).trim();
        activeDescription = plainText || `Read the full article ${blog.title} on Upgrader Boy Blogs.`;
      }
    }

    // 1. Update browser tab title
    document.title = activeTitle || "Upgrader Boy";

    // 2. Update favicon icon
    const faviconUrl = seo.faviconUrl || "/logo.png";
    const linkIcon = document.querySelector("link[rel='icon']") || document.querySelector("link[rel='shortcut icon']");
    if (linkIcon) {
      linkIcon.setAttribute("href", faviconUrl);
    }

    // 3. Update search engine meta description and social graphs
    document.querySelector("meta[name='description']")?.setAttribute("content", activeDescription);
    document.querySelector("meta[property='og:title']")?.setAttribute("content", activeTitle);
    document.querySelector("meta[property='og:description']")?.setAttribute("content", activeDescription);
    document.querySelector("meta[name='twitter:title']")?.setAttribute("content", activeTitle);
    document.querySelector("meta[name='twitter:description']")?.setAttribute("content", activeDescription);

    // 3. Inject/Update Schema.org JSON-LD Structured Data for Google Sitelinks
    let jsonLdScript = document.getElementById("sitelinks-jsonld") as HTMLScriptElement;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement("script");
      jsonLdScript.id = "sitelinks-jsonld";
      jsonLdScript.type = "application/ld+json";
      document.head.appendChild(jsonLdScript);
    }

    const mainUrl = window.location.origin;
    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${mainUrl}/#website`,
          "url": mainUrl,
          "name": seo.siteTitle,
          "description": seo.siteDescription,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${mainUrl}/blogs?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "SiteNavigationElement",
          "@id": `${mainUrl}/#navigation`,
          "name": seo.routes.map((r) => r.title),
          "url": seo.routes.map((r) => `${mainUrl}${r.path}`)
        }
      ]
    };

    jsonLdScript.textContent = JSON.stringify(schemaData, null, 2);
  }, [route, portfolioData]);

  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setRoute(to);
  };

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
    if (route === "/resources") {
      return <ResourcesPage navigate={navigate} />;
    }
    return <PortfolioContent navigate={navigate} />;
  };

  return (
    <>
      {route !== "/admin" && <Header currentRoute={route} navigate={navigate} />}
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