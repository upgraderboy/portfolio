import React, { useEffect, useState } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import "./blogs.css";

interface BlogPostPageProps {
  blogId: string;
  navigate: (to: string) => void;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ blogId, navigate }) => {
  const { fetchBlogPost, portfolioData } = usePortfolioData();
  const [blog, setBlog] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    let active = true;
    setLoading(true);
    fetchBlogPost(blogId).then((post) => {
      if (active) {
        setBlog(post);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [blogId, portfolioData.blogs, fetchBlogPost]);

  if (loading) {
    return (
      <div className="blog-post__container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        <div className="portfolio-loader-circle" style={{ borderColor: "rgba(0, 255, 30, 0.1)", borderTopColor: "var(--first-color)" }}></div>
        <div style={{ color: "var(--text-color-light)", marginTop: "1rem" }}>Loading article content...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-post__container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", textAlign: "center" }}>
        <i className="uil uil-exclamation-triangle" style={{ fontSize: "4rem", color: "var(--first-color)", marginBottom: "1.5rem" }}></i>
        <h2 style={{ color: "var(--title-color)", marginBottom: "1rem" }}>Article Not Found</h2>
        <p style={{ color: "var(--text-color-light)", marginBottom: "2rem" }}>The article you are looking for does not exist or has been deleted.</p>
        <button className="blogs__view-all-btn" onClick={() => navigate("/blogs")}>
          Back to Articles
        </button>
      </div>
    );
  }

  return (
    <div className="blog-post__container">
      {/* Back Button */}
      <div className="blog-post__back">
        <button className="blogs-page__back-btn" onClick={() => navigate("/blogs")}>
          <i className="uil uil-arrow-left"></i> Back to Articles
        </button>
      </div>

      {/* Article Header Meta */}
      <header className="blog-post__header">
        <div className="blog-post__meta">
          <span className="blog-post__date">
            <i className="uil uil-calendar-alt"></i> Published on {blog.date}
          </span>
        </div>
        <h1 className="blog-post__title">{blog.title}</h1>
      </header>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="blog-post__cover-wrapper">
          <img src={blog.coverImage} alt={blog.title} className="blog-post__cover" />
        </div>
      )}

      {/* Article Content Rendered safely */}
      <article className="blog-post__article" dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
};

export default BlogPostPage;
