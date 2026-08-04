import React, { useState, useEffect } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import "./resources.css";

interface ResourcesPageProps {
  navigate: (to: string) => void;
}

const ResourcesPage: React.FC<ResourcesPageProps> = ({ navigate }) => {
  const { portfolioData, isLoading } = usePortfolioData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
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
      const matchesCategory = selectedCategory === "All" || res.category === selectedCategory;
      const matchesSubcategory = selectedSubcategory === "All" || res.subcategory === selectedSubcategory;
      
      const matchesSearch = !term ||
        res.title.toLowerCase().includes(term) ||
        res.description.toLowerCase().includes(term) ||
        (res.source && res.source.toLowerCase().includes(term)) ||
        res.tags.some((tag: string) => tag.toLowerCase().includes(term));

      return matchesCategory && matchesSubcategory && matchesSearch;
    });

    setFilteredResources(filtered);
  }, [searchTerm, selectedCategory, selectedSubcategory, portfolioData.resources]);

  // Derived Categories & Subcategories list based on configuration
  const categories = ["All", ...(portfolioData.resourceCategories || []).map((c) => c.name)];
  
  // Find current subcategories of the active category
  const activeCategoryConfig = (portfolioData.resourceCategories || []).find((c) => c.name === selectedCategory);
  const subcategories = activeCategoryConfig ? ["All", ...activeCategoryConfig.subcategories] : ["All"];

  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName);
    setSelectedSubcategory("All"); // Reset subcategory when category changes
  };

  return (
    <div className="resources-page__container" style={{ padding: "6rem 1.5rem 4rem 1.5rem" }}>
      {/* Header */}
      <header className="resources-page__header" style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <h1 className="resources-page__title">Resources & Study Material</h1>
        <p className="resources-page__subtitle">
          Access course books, lecture notes, exam question papers, and study summaries
        </p>
      </header>

      {/* Navigation, Search, and Category Filtering */}
      <div className="resources-page__nav-wrapper" style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <button className="resources-page__back-btn" onClick={() => navigate("/")}>
            <i className="uil uil-arrow-left"></i> Back to Portfolio
          </button>

          <div className="resources-page__search-wrapper">
            <i className="uil uil-search resources-page__search-icon"></i>
            <input
              type="text"
              className="resources-page__search-input"
              placeholder="Search books, tags, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <i className="uil uil-times resources-page__search-clear" onClick={() => setSearchTerm("")}></i>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="resources-page__tabs" style={{ marginTop: "2rem" }}>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`resources-page__tab-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Subcategory Pills (Only displayed if selected category has subcategories configured) */}
        {selectedCategory !== "All" && subcategories.length > 1 && (
          <div className="resources-page__pills" style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {subcategories.map((sub, idx) => (
              <button
                key={idx}
                className={`resources-page__pill-btn ${selectedSubcategory === sub ? "active" : ""}`}
                onClick={() => setSelectedSubcategory(sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Resources Catalog Grid */}
      {isLoading ? (
        <div className="resources__grid">
          {[...Array(6)].map((_, i) => (
            <div className="resources__card skeleton-loader" key={i}>
              <div className="resources__card-icon skeleton" style={{ height: "48px", width: "48px", borderRadius: "8px" }}></div>
              <div className="resources__card-info" style={{ width: "100%" }}>
                <div className="skeleton" style={{ height: "14px", width: "30%", marginBottom: "0.75rem", borderRadius: "4px" }}></div>
                <div className="skeleton" style={{ height: "20px", width: "80%", marginBottom: "0.75rem", borderRadius: "4px" }}></div>
                <div className="skeleton" style={{ height: "14px", width: "95%", marginBottom: "0.5rem", borderRadius: "4px" }}></div>
                <div className="skeleton" style={{ height: "14px", width: "90%", marginBottom: "1rem", borderRadius: "4px" }}></div>
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
                <span className="resources__card-category">
                  {res.category} {res.subcategory && `› ${res.subcategory}`}
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
          <h3>No study materials found</h3>
          <p>Try searching another keyword or select a different category tab.</p>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
