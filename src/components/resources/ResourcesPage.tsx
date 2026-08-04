import React, { useState, useEffect } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import "./resources.css";

interface ResourcesPageProps {
  navigate: (to: string) => void;
}

const ResourcesPage: React.FC<ResourcesPageProps> = ({ navigate }) => {
  const { portfolioData, isLoading } = usePortfolioData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All"); // Matches node ID
  const [filteredResources, setFilteredResources] = useState<any[]>([]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Filter logic
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    const resources = portfolioData.resources || [];

    const filtered = resources.filter((res) => {
      // Recursive matching: matches if resource's categoryPath contains the selected node ID
      const matchesCategory = selectedCategory === "All" || (res.categoryPath && res.categoryPath.includes(selectedCategory));
      
      const matchesSearch = !term ||
        res.title.toLowerCase().includes(term) ||
        res.description.toLowerCase().includes(term) ||
        (res.source && res.source.toLowerCase().includes(term)) ||
        (res.tags && res.tags.some((tag: string) => tag.toLowerCase().includes(term)));

      return matchesCategory && matchesSearch;
    });

    setFilteredResources(filtered);
  }, [searchTerm, selectedCategory, portfolioData.resources]);

  // Resolves the category path IDs into a clean hierarchy breadcrumb e.g. B.Tech › CS › Books
  const resolveCategoryPathNames = (pathIds: string[]): string => {
    if (!pathIds || pathIds.length === 0) return "General";
    const names: string[] = [];
    let currentNodes = portfolioData.resourceCategories || [];

    for (const id of pathIds) {
      const node: any = currentNodes.find((n: any) => n.id === id);
      if (node) {
        names.push(node.name);
        currentNodes = node.children || [];
      } else {
        break;
      }
    }
    return names.join(" › ");
  };

  // Recursive Sidebar Folder Tree Visualizer Node
  const renderSidebarTreeNode = (node: any, depth = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedCategory === node.id;
    
    return (
      <div key={node.id} className="resources-page__tree-node" style={{ marginLeft: depth > 0 ? "0.75rem" : "0" }}>
        <div 
          className={`resources-page__node-header ${isSelected ? "active" : ""}`}
          onClick={() => setSelectedCategory(isSelected ? "All" : node.id)}
        >
          <span style={{ display: "flex", alignItems: "center", columnGap: "0.35rem" }}>
            <i 
              className={hasChildren ? "uil uil-folder" : "uil uil-file-alt"} 
              style={{ color: isSelected ? "var(--green-color)" : "var(--text-color-light)" }}
            ></i>
            {node.name}
          </span>
          {hasChildren && (
            <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>
              ({node.children.length})
            </span>
          )}
        </div>
        {hasChildren && node.children.map((child: any) => renderSidebarTreeNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="resources-page__container" style={{ padding: "6rem 1.5rem 4rem 1.5rem" }}>
      {/* Header */}
      <header className="resources-page__header" style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <h1 className="resources-page__title">Resources & Study Material</h1>
        <p className="resources-page__subtitle">
          Explore nested course folders, lecture notes, syllabus sheets, and dynamic directories
        </p>
      </header>

      {/* Navigation & Search Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <button className="resources-page__back-btn" onClick={() => navigate("/")}>
          <i className="uil uil-arrow-left"></i> Back to Portfolio
        </button>

        <div className="resources-page__search-wrapper">
          <i className="uil uil-search resources-page__search-icon"></i>
          <input
            type="text"
            className="resources-page__search-input"
            placeholder="Search resources, tags, authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <i className="uil uil-times resources-page__search-clear" onClick={() => setSearchTerm("")}></i>
          )}
        </div>
      </div>

      {/* Sidebar Grid Layout */}
      <div className="resources-page__layout">
        {/* Sidebar Folder Accordion */}
        <aside className="resources-page__sidebar">
          <h3 className="resources-page__sidebar-title">
            <i className="uil uil-sitemap" style={{ color: "var(--green-color)" }}></i> Folders Hierarchy
          </h3>
          
          {/* Root Level selector */}
          <div 
            className={`resources-page__node-header ${selectedCategory === "All" ? "active" : ""}`}
            style={{ fontWeight: "600", marginBottom: "0.5rem" }}
            onClick={() => setSelectedCategory("All")}
          >
            <span style={{ display: "flex", alignItems: "center", columnGap: "0.35rem" }}>
              <i className="uil uil-apps"></i> All Categories
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {(portfolioData.resourceCategories || []).length > 0 ? (
              (portfolioData.resourceCategories || []).map((cat) => renderSidebarTreeNode(cat))
            ) : (
              <span style={{ fontSize: "0.8rem", color: "var(--text-color-light)", fontStyle: "italic" }}>
                No categories configured.
              </span>
            )}
          </div>
        </aside>

        {/* Catalog Grid View */}
        <main>
          {isLoading ? (
            <div className="resources__grid">
              {[...Array(4)].map((_, i) => (
                <div className="resources__card skeleton-loader" key={i}>
                  <div className="resources__card-icon skeleton" style={{ height: "48px", width: "48px", borderRadius: "8px" }}></div>
                  <div className="resources__card-info" style={{ width: "100%" }}>
                    <div className="skeleton" style={{ height: "14px", width: "30%", marginBottom: "0.75rem", borderRadius: "4px" }}></div>
                    <div className="skeleton" style={{ height: "20px", width: "80%", marginBottom: "0.75rem", borderRadius: "4px" }}></div>
                    <div className="skeleton" style={{ height: "14px", width: "95%", marginBottom: "0.5rem", borderRadius: "4px" }}></div>
                    <div className="skeleton" style={{ height: "36px", width: "120px", borderRadius: "4px" }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="resources__grid">
              {filteredResources.map((res) => (
                <div className="resources__card" key={res.id}>
                  <div className="resources__card-icon">
                    <i className="uil uil-file-pdf"></i>
                  </div>
                  <div className="resources__card-info">
                    <span className="resources__card-category" title={resolveCategoryPathNames(res.categoryPath)}>
                      {resolveCategoryPathNames(res.categoryPath)}
                    </span>
                    <h3 className="resources__card-title">{res.title}</h3>
                    <p className="resources__card-description">{res.description}</p>
                    
                    {res.source && (
                      <span className="resources__card-source">
                        <i className="uil uil-user"></i> Source: {res.source}
                      </span>
                    )}
                    
                    {res.tags && res.tags.length > 0 && (
                      <div className="resources__card-tags">
                        {res.tags.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="resources__card-tag"
                            onClick={() => setSearchTerm(tag)}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      className="resources__card-btn button button--flex"
                      onClick={() => window.location.href = `/flipbook/index.html?pdf=${encodeURIComponent(res.pdfUrl)}`}
                    >
                      Read Document
                      <i className="uil uil-book-open button__icon" style={{ marginLeft: "0.5rem" }}></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "5rem 1.5rem", color: "var(--text-color-light)" }}>
              <i className="uil uil-folder-question" style={{ fontSize: "3rem", display: "block", marginBottom: "1rem", color: "var(--green-color)" }}></i>
              <h3>No catalog documents found</h3>
              <p>Try searching another keyword or select a different folder in the tree side panel.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ResourcesPage;
