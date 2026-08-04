import React, { useEffect, useState } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import AuthorImg from "../../assets/Ankit Bhuria.jpeg";
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
      <div class="pdf-container" style="margin: 24px 0;">
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [claps, setClaps] = useState(0);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load claps count from localStorage
  useEffect(() => {
    const savedClaps = localStorage.getItem(`blog_claps_${blogId}`);
    if (savedClaps) {
      setClaps(parseInt(savedClaps, 10));
    } else {
      // Default baseline claps count
      setClaps(Math.floor(Math.random() * 25) + 12);
    }
  }, [blogId]);

  // Scroll Progress Bar Tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch article contents on mount
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

  // Trigger clap appreciation increments
  const handleClap = () => {
    const newClaps = claps + 1;
    setClaps(newClaps);
    localStorage.setItem(`blog_claps_${blogId}`, newClaps.toString());
  };

  // Copy article link to clipboard
  const handleCopyLink = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      setShowShareDropdown(false);
    });
  };

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

  // Calculate approximate reading duration
  const wordCount = blog.content ? blog.content.replace(/<[^>]*>/g, "").split(/\s+/).length : 0;
  const readTime = Math.max(Math.ceil(wordCount / 200), 2);

  // Fetch related articles (excluding current one)
  const relatedPosts = (portfolioData.blogs || [])
    .filter((post: any) => post.id !== blogId)
    .slice(0, 2);

  const shareUrl = window.location.href;
  const shareTitle = encodeURIComponent(blog.title);

  return (
    <>
      {/* Sleek Reading Progress Indicator */}
      <div 
        style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          width: `${scrollProgress}%`, 
          height: "4px", 
          backgroundColor: "var(--green-color)", 
          zIndex: 9999, 
          transition: "width 0.1s ease" 
        }} 
      />

      <div className="blog-post__container">
        {/* Navigation Action Bar */}
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "2.5rem", 
            flexWrap: "wrap",
            gap: "1rem"
          }}
        >
          <button 
            className="blogs-page__back-btn" 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              columnGap: "0.5rem",
              background: "transparent",
              border: "none",
              color: "var(--text-color-light)",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: 500,
              padding: 0,
              transition: "color 0.2s"
            }} 
            onClick={() => navigate("/blogs")}
          >
            <i className="uil uil-arrow-left" style={{ fontSize: "1.25rem" }}></i> Back to Articles
          </button>

          {/* Social Share Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                columnGap: "0.5rem",
                background: "rgba(100, 116, 139, 0.08)",
                border: "1px solid rgba(100, 116, 139, 0.15)",
                color: "var(--title-color)",
                padding: "0.5rem 1rem",
                borderRadius: "2rem",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 600,
                transition: "all 0.2s"
              }}
              onClick={() => setShowShareDropdown(!showShareDropdown)}
            >
              <i className="uil uil-share-alt" style={{ fontSize: "1rem" }}></i> Share Article
            </button>

            {showShareDropdown && (
              <div 
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 0.5rem)",
                  backgroundColor: "var(--container-color)",
                  border: "1px solid rgba(100, 116, 139, 0.15)",
                  borderRadius: "0.75rem",
                  padding: "0.5rem",
                  zIndex: 100,
                  minWidth: "180px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                }}
              >
                <a 
                  href={`https://api.whatsapp.com/send?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "0.75rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.5rem",
                    color: "var(--text-color)",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    transition: "background 0.2s"
                  }}
                  className="blog-post__share-item"
                  onClick={() => setShowShareDropdown(false)}
                >
                  <i className="uil uil-whatsapp" style={{ color: "#25D366", fontSize: "1.1rem" }}></i> WhatsApp
                </a>

                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "0.75rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.5rem",
                    color: "var(--text-color)",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    transition: "background 0.2s"
                  }}
                  className="blog-post__share-item"
                  onClick={() => setShowShareDropdown(false)}
                >
                  <i className="uil uil-linkedin" style={{ color: "#0077B5", fontSize: "1.1rem" }}></i> LinkedIn
                </a>

                <a 
                  href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "0.75rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.5rem",
                    color: "var(--text-color)",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    transition: "background 0.2s"
                  }}
                  className="blog-post__share-item"
                  onClick={() => setShowShareDropdown(false)}
                >
                  <i className="uil uil-twitter" style={{ color: "#1DA1F2", fontSize: "1.1rem" }}></i> Twitter / X
                </a>

                <button 
                  onClick={handleCopyLink}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "0.75rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.5rem",
                    color: "var(--text-color)",
                    background: "transparent",
                    border: "none",
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    transition: "background 0.2s"
                  }}
                  className="blog-post__share-item"
                >
                  <i className="uil uil-copy" style={{ color: "var(--green-color)", fontSize: "1.1rem" }}></i> Copy Link
                </button>
              </div>
            )}

            {copiedLink && (
              <div 
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: "calc(100% + 0.5rem)",
                  backgroundColor: "var(--title-color)",
                  color: "var(--container-color)",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  zIndex: 200,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}
              >
                Copied Link!
              </div>
            )}
          </div>
        </div>

        {/* Article Author Profile & Meta Row */}
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            columnGap: "1rem", 
            marginBottom: "1.5rem",
            borderBottom: "1px solid rgba(100, 116, 139, 0.15)",
            paddingBottom: "1.5rem"
          }}
        >
          <img 
            src={AuthorImg} 
            alt="Ankit Bhuria" 
            style={{ 
              width: "48px", 
              height: "48px", 
              borderRadius: "50%", 
              objectFit: "cover",
              border: "2px solid var(--green-color)"
            }} 
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600, color: "var(--title-color)", fontSize: "0.95rem" }}>Ankit Bhuria</span>
            <div style={{ display: "flex", alignItems: "center", columnGap: "0.5rem", flexWrap: "wrap", fontSize: "0.8rem", color: "var(--text-color-light)" }}>
              <span>Published on {blog.date}</span>
              <span>•</span>
              <span style={{ display: "inline-flex", alignItems: "center", columnGap: "0.25rem" }}>
                <i className="uil uil-clock" style={{ color: "var(--green-color)" }}></i> {readTime} min read
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="blog-post__title" style={{ marginBottom: "1.75rem" }}>{blog.title}</h1>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="blog-post__cover-wrapper" style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}>
            <img src={blog.coverImage} alt={blog.title} className="blog-post__cover" />
          </div>
        )}

        {/* Article Content */}
        <article className="blog-post__article" dangerouslySetInnerHTML={{ __html: formatPostContent(blog.content) }} />

        {/* Dynamic Clapping Reaction & Bottom Share Row */}
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginTop: "4rem", 
            paddingTop: "2rem",
            borderTop: "1px solid rgba(100, 116, 139, 0.15)",
            flexWrap: "wrap",
            gap: "1.5rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", columnGap: "0.75rem" }}>
            <button 
              onClick={handleClap}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(1, 195, 105, 0.08)",
                border: "1px solid rgba(1, 195, 105, 0.2)",
                cursor: "pointer",
                transition: "transform 0.15s ease",
                outline: "none"
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.9)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              title="Clap for this post!"
            >
              <span style={{ fontSize: "1.5rem" }}>👏</span>
            </button>
            <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--title-color)" }}>
              {claps} claps
            </span>
          </div>

          <div style={{ display: "flex", columnGap: "0.5rem" }}>
            <a 
              href={`https://api.whatsapp.com/send?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(37, 211, 102, 0.1)",
                color: "#25D366",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: "1.1rem",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <i className="uil uil-whatsapp"></i>
            </a>
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(0, 119, 181, 0.1)",
                color: "#0077B5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: "1.1rem",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <i className="uil uil-linkedin"></i>
            </a>
            <a 
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(29, 161, 246, 0.1)",
                color: "#1DA1F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: "1.1rem",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <i className="uil uil-twitter"></i>
            </a>
          </div>
        </div>

        {/* Professional Author Signature Bio Card */}
        <div 
          style={{ 
            marginTop: "3rem", 
            padding: "2rem", 
            borderRadius: "1rem", 
            border: "1px solid rgba(100, 116, 139, 0.15)",
            background: "linear-gradient(135deg, rgba(100, 116, 139, 0.03) 0%, rgba(100, 116, 139, 0.08) 100%)",
            display: "flex",
            columnGap: "1.5rem",
            alignItems: "center",
            flexWrap: "wrap",
            rowGap: "1.25rem"
          }}
        >
          <img 
            src={AuthorImg} 
            alt="Ankit Bhuria" 
            style={{ 
              width: "80px", 
              height: "80px", 
              borderRadius: "50%", 
              objectFit: "cover",
              border: "3px solid var(--green-color)"
            }} 
          />
          <div style={{ flex: 1, minWidth: "200px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--green-color)", fontWeight: 700, textTransform: "uppercase" }}>Written By</span>
            <h4 style={{ fontSize: "1.25rem", color: "var(--title-color)", margin: "0.15rem 0 0.5rem" }}>Ankit Bhuria</h4>
            <p style={{ fontSize: "var(--small-font-size)", color: "var(--text-color-light)", margin: 0, lineHeight: "1.5" }}>
              Software Developer & Tech Innovator. I write about full-stack web architectures, systems engineering, clean code structures, and learning in public.
            </p>
          </div>
        </div>

        {/* Read Next / Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div style={{ marginTop: "4.5rem" }}>
            <h3 style={{ fontSize: "1.3rem", color: "var(--title-color)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="uil uil-book-open" style={{ color: "var(--green-color)" }}></i> Read Next
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {relatedPosts.map((post: any) => (
                <div 
                  key={post.id}
                  onClick={() => navigate(`/blogs/${post.id}`)}
                  style={{
                    backgroundColor: "var(--container-color)",
                    border: "1px solid rgba(100, 116, 139, 0.15)",
                    borderRadius: "0.75rem",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.25s, border-color 0.25s",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "var(--green-color)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "rgba(100, 116, 139, 0.15)";
                  }}
                >
                  {post.coverImage && (
                    <div style={{ height: "150px", overflow: "hidden" }}>
                      <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-color-light)", marginBottom: "0.5rem" }}>{post.date}</span>
                    <h4 style={{ fontSize: "1rem", color: "var(--title-color)", margin: "0 0 0.5rem", lineHeight: "1.4", fontWeight: 600 }}>{post.title}</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-color-light)", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {post.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogPostPage;
