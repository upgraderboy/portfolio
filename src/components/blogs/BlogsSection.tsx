import React, { useEffect, useState } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import "./blogs.css";

interface BlogsSectionProps {
  navigate: (to: string) => void;
}

const BlogsSection: React.FC<BlogsSectionProps> = ({ navigate }) => {
  const { fetchBlogs, portfolioData } = usePortfolioData();
  const [displayedBlogs, setDisplayedBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchBlogs().then((list) => {
      if (active) {
        const publicBlogs = list.filter((b) => b.status !== "draft").slice(0, 3);
        setDisplayedBlogs(publicBlogs);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [portfolioData.blogs, fetchBlogs]);

  const getExcerpt = (html: string) => {
    const cleanText = html.replace(/<[^>]*>/g, " ");
    const trimmed = cleanText.trim().replace(/\s+/g, " ");
    if (trimmed.length > 100) {
      return trimmed.substring(0, 100) + "...";
    }
    return trimmed;
  };

  const totalPublicBlogs = (portfolioData.blogs || []).filter((b) => b.status !== "draft").length;

  if (loading) {
    return (
      <section className="blogs__section section" id="blogs">
        <h2 className="section__title">Blogs</h2>
        <span className="section__subtitle">Technical Articles & Insights</span>
        <div style={{ textAlign: "center", color: "var(--text-color-light)", padding: "2rem" }}>Loading articles...</div>
      </section>
    );
  }

  if (displayedBlogs.length === 0) {
    return null;
  }

  return (
    <section className="blogs__section section" id="blogs">
      <h2 className="section__title">Blogs</h2>
      <span className="section__subtitle">Technical Articles & Insights</span>

      <div className="blogs__container container">
        <div className="blogs__grid">
          {displayedBlogs.map((blog) => (
            <div className="blog__card" key={blog.id}>
              <div className="blog__card-img-wrapper">
                {blog.coverImage ? (
                  <img src={blog.coverImage} alt={blog.title} className="blog__card-img" />
                ) : (
                  <div
                    className="blog__card-img"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(100, 116, 139, 0.1)",
                      color: "var(--text-color-light)",
                      fontSize: "2.5rem",
                      height: "100%",
                    }}
                  >
                    <i className="uil uil-image"></i>
                  </div>
                )}
              </div>

              <div className="blog__card-content">
                <span className="blog__card-date">
                  <i className="uil uil-calendar-alt"></i> {blog.date}
                </span>
                <h3 className="blog__card-title">{blog.title}</h3>
                <p className="blog__card-excerpt">{getExcerpt(blog.content)}</p>
                <div className="blog__card-link" onClick={() => navigate(`/blogs/${blog.id}`)}>
                  Read Post <i className="uil uil-arrow-right"></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPublicBlogs > 3 && (
          <div className="blogs__view-all-container" style={{ marginTop: "3rem" }}>
            <button className="blogs__view-all-btn" onClick={() => navigate("/blogs")}>
              View All Articles <i className="uil uil-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogsSection;
