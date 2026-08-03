import React, { useEffect, useState } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import "./blogs.css";

const formatPostContent = (html: string): string => {
  if (!html) return "";

  let parsed = html;

  // Regex to match existing/legacy Google Drive preview iframes and capture surrounding attributes
  const driveRegex = /<iframe([^>]*)src="https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/preview"([^>]*)><\/iframe>/g;
  
  parsed = parsed.replace(driveRegex, (match, attrsBefore, fileId, attrsAfter) => {
    const allAttrs = (attrsBefore || "") + (attrsAfter || "");
    
    // If it is a video (contains autoplay or is embedded as video size), skip upgrading
    if (allAttrs.includes("autoplay") || allAttrs.includes("controls")) {
      return match;
    }
    
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    return `
      <div class="pdf-container" style="margin: 16px 0;">
        <div class="pdf-download-bar" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background-color: var(--card-color); border: 1px solid var(--border-color); border-radius: 8px 8px 0 0; margin-bottom: 0;">
          <span style="font-weight: 500; color: var(--title-color); display: inline-flex; align-items: center; gap: 8px;"><i class="uil uil-file-alt" style="color: var(--green-color); font-size: 1.2rem;"></i> Shared Document (Google Drive)</span>
          <a href="${downloadUrl}" target="_blank" rel="noopener noreferrer" style="padding: 6px 12px; font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; background-color: var(--first-color); color: #fff; border-radius: 6px; font-weight: 500;">Download File <i class="uil uil-import"></i></a>
        </div>
        <iframe src="/flipbook/index.html?file=${encodeURIComponent(downloadUrl)}" width="100%" height="600" style="width: 100%; height: 600px; border: 1px solid var(--border-color); border-top: none; border-radius: 0 0 8px 8px; display: block;" frameborder="0" allowfullscreen></iframe>
      </div>
    `;
  });

  return parsed;
};

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
      <article className="blog-post__article" dangerouslySetInnerHTML={{ __html: formatPostContent(blog.content) }} />
    </div>
  );
};

export default BlogPostPage;
