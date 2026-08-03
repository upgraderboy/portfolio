import React, { useState, useEffect } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import {
  ProjectItem,
  TestimonialItem,
  MemoryItem,
  SkillItem,
  QualificationItem,
} from "../db/portfolioDb";
import "./admin.css";

interface AdminProps {
  navigate: (to: string) => void;
}

const Admin: React.FC<AdminProps> = ({ navigate }) => {
  const {
    portfolioData,
    updateHomeAbout,
    updateSkills,
    updateQualification,
    updateProjects,
    updateTestimonials,
    updateMemories,
  } = usePortfolioData();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // Navigation State (Active Tab)
  const [activeTab, setActiveTab] = useState<string>("home-about");

  // Form Edit/Add States
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setEditingId(null);
  }, [activeTab]);

  // Home & About State
  const [homeName, setHomeName] = useState(portfolioData.home.name);
  const [homeSubtitle, setHomeSubtitle] = useState(portfolioData.home.subtitle);
  const [homeDescription, setHomeDescription] = useState(portfolioData.home.description);
  const [aboutDescription, setAboutDescription] = useState(portfolioData.about.description);
  const [aboutExpYears, setAboutExpYears] = useState(portfolioData.about.experienceYears);
  const [aboutProjects, setAboutProjects] = useState(portfolioData.about.completedProjects);
  const [aboutSupport, setAboutSupport] = useState(portfolioData.about.supportAvailability);
  const [aboutCvUrl, setAboutCvUrl] = useState(portfolioData.about.cvUrl || "");

  // Projects State Form
  const [projTitle, setProjTitle] = useState("");
  const [projCategory, setProjCategory] = useState("Web App");
  const [projImage, setProjImage] = useState("");
  const [projDemo, setProjDemo] = useState("");
  const [projBuy, setProjBuy] = useState("");
  const [projGithub, setProjGithub] = useState("");

  // Testimonials State Form
  const [tstTitle, setTstTitle] = useState("");
  const [tstImage, setTstImage] = useState("");
  const [tstDescription, setTstDescription] = useState("");

  // Memories State Form
  const [memTitle, setMemTitle] = useState("");
  const [memDate, setMemDate] = useState("");
  const [memCategory, setMemCategory] = useState("");
  const [memDescription, setMemDescription] = useState("");
  const [memImages, setMemImages] = useState<string[]>([""]);

  // Skills State Form
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [skillType, setSkillType] = useState<"frontend" | "backend">("frontend");


  // Qualifications State Form
  const [qType, setQType] = useState<"education" | "experience">("education");
  const [qTitle, setQTitle] = useState("");
  const [qSubtitle, setQSubtitle] = useState("");
  const [qCalendar, setQCalendar] = useState("");

  // Skills & Qualifications Editing States
  const [editingSkillKey, setEditingSkillKey] = useState<string | null>(null);
  const [editSkillName, setEditSkillName] = useState("");
  const [editSkillLevel, setEditSkillLevel] = useState("");

  const [editingQualId, setEditingQualId] = useState<string | null>(null);
  const [editQualTitle, setEditQualTitle] = useState("");
  const [editQualSubtitle, setEditQualSubtitle] = useState("");
  const [editQualCalendar, setEditQualCalendar] = useState("");

  // Drag & Drop Reordering States
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragSource, setDragSource] = useState<string | null>(null);

  const handleDragStart = (index: number, source: string) => {
    setDraggedIndex(index);
    setDragSource(source);
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number, source: string) => {
    e.preventDefault();
    if (draggedIndex === null || dragSource !== source || draggedIndex === targetIndex) return;

    if (source === "projects") {
      const items = [...portfolioData.projects];
      const draggedItem = items[draggedIndex];
      items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      updateProjects(items);
      setDraggedIndex(targetIndex);
    } else if (source === "testimonials") {
      const items = [...portfolioData.testimonials];
      const draggedItem = items[draggedIndex];
      items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      updateTestimonials(items);
      setDraggedIndex(targetIndex);
    } else if (source === "memories") {
      const items = [...portfolioData.memories];
      const draggedItem = items[draggedIndex];
      items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      updateMemories(items);
      setDraggedIndex(targetIndex);
    } else if (source === "frontend-skills") {
      const items = [...portfolioData.skills.frontend];
      const draggedItem = items[draggedIndex];
      items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      updateSkills({ ...portfolioData.skills, frontend: items });
      setDraggedIndex(targetIndex);
    } else if (source === "backend-skills") {
      const items = [...portfolioData.skills.backend];
      const draggedItem = items[draggedIndex];
      items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      updateSkills({ ...portfolioData.skills, backend: items });
      setDraggedIndex(targetIndex);
    } else if (source === "education") {
      const items = [...portfolioData.qualification.education];
      const draggedItem = items[draggedIndex];
      items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      updateQualification({ ...portfolioData.qualification, education: items });
      setDraggedIndex(targetIndex);
    } else if (source === "experience") {
      const items = [...portfolioData.qualification.experience];
      const draggedItem = items[draggedIndex];
      items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      updateQualification({ ...portfolioData.qualification, experience: items });
      setDraggedIndex(targetIndex);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragSource(null);
  };

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("portfolio_admin_logged_in");
    if (loggedIn === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Update states when portfolio data loads/changes
  useEffect(() => {
    setHomeName(portfolioData.home.name);
    setHomeSubtitle(portfolioData.home.subtitle);
    setHomeDescription(portfolioData.home.description);
    setAboutDescription(portfolioData.about.description);
    setAboutExpYears(portfolioData.about.experienceYears);
    setAboutProjects(portfolioData.about.completedProjects);
    setAboutSupport(portfolioData.about.supportAvailability);
  }, [portfolioData]);

  // Auth Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
    if (passwordInput === correctPassword) {
      sessionStorage.setItem("portfolio_admin_logged_in", "true");
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("portfolio_admin_logged_in");
    setIsAuthenticated(false);
    setPasswordInput("");
    navigate("/");
  };

  // Image upload base64 converter
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Memories dynamic image upload
  const handleMemoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...memImages];
      updated[index] = reader.result as string;
      setMemImages(updated);
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }

    if (file.size > 800 * 1024) {
      alert("File is too large. Please upload a PDF under 800KB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAboutCvUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // CRUD Actions
  // 1. Save Home & About text content
  const handleSaveHomeAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomeAbout(
      { name: homeName, subtitle: homeSubtitle, description: homeDescription },
      {
        description: aboutDescription,
        experienceYears: aboutExpYears,
        completedProjects: aboutProjects,
        supportAvailability: aboutSupport,
        cvUrl: aboutCvUrl,
      }
    );
    alert("Home and About sections updated successfully!");
  };

  // 2. Project CRUD
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProj: ProjectItem = {
      id: "proj-" + Date.now(),
      title: projTitle,
      category: projCategory,
      image: projImage || "https://raw.githubusercontent.com/upgraderboy/portfolio/main/src/assets/Portfolio.png",
      demo: projDemo || undefined,
      buy: projBuy || undefined,
      github: projGithub || undefined,
    };
    updateProjects([newProj, ...portfolioData.projects]);
    resetProjectForm();
  };

  const handleEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const updated = portfolioData.projects.map((p) => {
      if (p.id === editingId) {
        return {
          ...p,
          title: projTitle,
          category: projCategory,
          image: projImage,
          demo: projDemo || undefined,
          buy: projBuy || undefined,
          github: projGithub || undefined,
        };
      }
      return p;
    });
    updateProjects(updated);
    resetProjectForm();
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      updateProjects(portfolioData.projects.filter((p) => p.id !== id));
    }
  };

  const startEditProject = (p: ProjectItem) => {
    setEditingId(p.id);
    setProjTitle(p.title);
    setProjCategory(p.category);
    setProjImage(p.image);
    setProjDemo(p.demo || "");
    setProjBuy(p.buy || "");
    setProjGithub(p.github || "");
  };

  const resetProjectForm = () => {
    setEditingId(null);
    setProjTitle("");
    setProjCategory("Web App");
    setProjImage("");
    setProjDemo("");
    setProjBuy("");
    setProjGithub("");
  };

  // 3. Testimonial CRUD
  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    const newTst: TestimonialItem = {
      id: "tst-" + Date.now(),
      title: tstTitle,
      image: tstImage || "https://raw.githubusercontent.com/upgraderboy/portfolio/main/src/assets/UB.png",
      description: tstDescription,
    };
    updateTestimonials([...portfolioData.testimonials, newTst]);
    resetTestimonialForm();
  };

  const handleEditTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const updated = portfolioData.testimonials.map((t) => {
      if (t.id === editingId) {
        return { ...t, title: tstTitle, image: tstImage, description: tstDescription };
      }
      return t;
    });
    updateTestimonials(updated);
    resetTestimonialForm();
  };

  const handleDeleteTestimonial = (id: string) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      updateTestimonials(portfolioData.testimonials.filter((t) => t.id !== id));
    }
  };

  const startEditTestimonial = (t: TestimonialItem) => {
    setEditingId(t.id);
    setTstTitle(t.title);
    setTstImage(t.image);
    setTstDescription(t.description);
  };

  const resetTestimonialForm = () => {
    setEditingId(null);
    setTstTitle("");
    setTstImage("");
    setTstDescription("");
  };

  // 4. Memory CRUD
  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredImages = memImages.filter((img) => img.trim() !== "");
    const newMem: MemoryItem = {
      id: "mem-" + Date.now(),
      title: memTitle,
      date: memDate,
      category: memCategory || "General",
      description: memDescription,
      images: filteredImages.length > 0 ? filteredImages : ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"],
    };
    updateMemories([newMem, ...portfolioData.memories]);
    resetMemoryForm();
  };

  const handleEditMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const filteredImages = memImages.filter((img) => img.trim() !== "");
    const updated = portfolioData.memories.map((m) => {
      if (m.id === editingId) {
        return {
          ...m,
          title: memTitle,
          date: memDate,
          category: memCategory || "General",
          description: memDescription,
          images: filteredImages.length > 0 ? filteredImages : m.images,
        };
      }
      return m;
    });
    updateMemories(updated);
    resetMemoryForm();
  };

  const handleDeleteMemory = (id: string) => {
    if (window.confirm("Are you sure you want to delete this memory?")) {
      updateMemories(portfolioData.memories.filter((m) => m.id !== id));
    }
  };

  const startEditMemory = (m: MemoryItem) => {
    setEditingId(m.id);
    setMemTitle(m.title);
    setMemDate(m.date);
    setMemCategory(m.category);
    setMemDescription(m.description);
    setMemImages(m.images);
  };

  const resetMemoryForm = () => {
    setEditingId(null);
    setMemTitle("");
    setMemDate("");
    setMemCategory("");
    setMemDescription("");
    setMemImages([""]);
  };

  // Skills Inline Editing Helpers
  const startEditSkill = (type: "frontend" | "backend", s: SkillItem) => {
    setEditingSkillKey(`${type}-${s.name}`);
    setEditSkillName(s.name);
    setEditSkillLevel(s.level);
  };

  const handleSaveSkillEdit = (type: "frontend" | "backend", oldName: string) => {
    if (!editSkillName) return;
    const updatedSkills = { ...portfolioData.skills };
    if (type === "frontend") {
      updatedSkills.frontend = updatedSkills.frontend.map((s) =>
        s.name === oldName ? { name: editSkillName, level: editSkillLevel } : s
      );
    } else {
      updatedSkills.backend = updatedSkills.backend.map((s) =>
        s.name === oldName ? { name: editSkillName, level: editSkillLevel } : s
      );
    }
    updateSkills(updatedSkills);
    setEditingSkillKey(null);
  };

  const handleCancelSkillEdit = () => {
    setEditingSkillKey(null);
  };

  // Qualifications Inline Editing Helpers
  const startEditQualification = (q: QualificationItem) => {
    setEditingQualId(q.id);
    setEditQualTitle(q.title);
    setEditQualSubtitle(q.subtitle);
    setEditQualCalendar(q.calendar);
  };

  const handleSaveQualificationEdit = (type: "education" | "experience", id: string) => {
    if (!editQualTitle || !editQualSubtitle || !editQualCalendar) return;
    const updatedQ = { ...portfolioData.qualification };
    if (type === "education") {
      updatedQ.education = updatedQ.education.map((q) =>
        q.id === id ? { id, title: editQualTitle, subtitle: editQualSubtitle, calendar: editQualCalendar } : q
      );
    } else {
      updatedQ.experience = updatedQ.experience.map((q) =>
        q.id === id ? { id, title: editQualTitle, subtitle: editQualSubtitle, calendar: editQualCalendar } : q
      );
    }
    updateQualification(updatedQ);
    setEditingQualId(null);
  };

  const handleCancelQualificationEdit = () => {
    setEditingQualId(null);
  };

  // 5. Skills CRUD
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const newSkill: SkillItem = { name: skillName, level: skillLevel };
    const updatedSkills = { ...portfolioData.skills };
    if (skillType === "frontend") {
      updatedSkills.frontend = [...updatedSkills.frontend, newSkill];
    } else {
      updatedSkills.backend = [...updatedSkills.backend, newSkill];
    }
    updateSkills(updatedSkills);
    setSkillName("");
  };

  const handleDeleteSkill = (type: "frontend" | "backend", name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      const updatedSkills = { ...portfolioData.skills };
      if (type === "frontend") {
        updatedSkills.frontend = updatedSkills.frontend.filter((s) => s.name !== name);
      } else {
        updatedSkills.backend = updatedSkills.backend.filter((s) => s.name !== name);
      }
      updateSkills(updatedSkills);
    }
  };

  // 6. Qualification CRUD
  const handleAddQualification = (e: React.FormEvent) => {
    e.preventDefault();
    const newQ: QualificationItem = {
      id: "q-" + Date.now(),
      title: qTitle,
      subtitle: qSubtitle,
      calendar: qCalendar,
    };
    const updatedQ = { ...portfolioData.qualification };
    if (qType === "education") {
      updatedQ.education = [...updatedQ.education, newQ];
    } else {
      updatedQ.experience = [...updatedQ.experience, newQ];
    }
    updateQualification(updatedQ);
    resetQForm();
  };

  const handleDeleteQualification = (type: "education" | "experience", id: string) => {
    if (window.confirm("Are you sure you want to delete this qualification?")) {
      const updatedQ = { ...portfolioData.qualification };
      if (type === "education") {
        updatedQ.education = updatedQ.education.filter((q) => q.id !== id);
      } else {
        updatedQ.experience = updatedQ.experience.filter((q) => q.id !== id);
      }
      updateQualification(updatedQ);
    }
  };

  const resetQForm = () => {
    setQTitle("");
    setQSubtitle("");
    setQCalendar("");
  };

  // Render Login Card if not Authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin__login-container">
        <div className="admin__login-card">
          <h2 className="admin__login-title">Admin CMS Login</h2>
          <span className="admin__login-subtitle">Portfolio Content Management</span>

          {authError && <div className="admin__login-error">{authError}</div>}

          <form onSubmit={handleLogin}>
            <div className="admin__form-group">
              <label className="admin__form-label" style={{ textAlign: "left" }}>
                Enter Admin Password
              </label>
              <input
                type="password"
                className="admin__form-input"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="admin__login-btn">
              Login to Dashboard
            </button>
            <button
              type="button"
              className="admin__btn admin__btn--secondary"
              style={{ width: "100%", marginTop: "1rem", display: "block" }}
              onClick={() => navigate("/")}
            >
              Back to Portfolio
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin__layout">
      {/* Sidebar Navigation */}
      <div className="admin__sidebar">
        <div className="admin__sidebar-header">
          <span className="admin__sidebar-title">Admin Control Panel</span>
        </div>

        <div className="admin__nav">
          <div
            className={`admin__nav-item ${activeTab === "home-about" ? "active" : ""}`}
            onClick={() => setActiveTab("home-about")}
          >
            <i className="uil uil-home"></i> Home & About
          </div>
          <div
            className={`admin__nav-item ${activeTab === "skills-qual" ? "active" : ""}`}
            onClick={() => setActiveTab("skills-qual")}
          >
            <i className="uil uil-file-alt"></i> Skills & Journey
          </div>
          <div
            className={`admin__nav-item ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            <i className="uil uil-scenery"></i> Projects (Portfolio)
          </div>
          <div
            className={`admin__nav-item ${activeTab === "testimonials" ? "active" : ""}`}
            onClick={() => setActiveTab("testimonials")}
          >
            <i className="uil uil-comment-message"></i> Testimonials
          </div>
          <div
            className={`admin__nav-item ${activeTab === "memories" ? "active" : ""}`}
            onClick={() => setActiveTab("memories")}
          >
            <i className="uil uil-image-v"></i> Memories
          </div>
        </div>

        <button className="admin__btn admin__btn--secondary" onClick={() => navigate("/")} style={{ marginBottom: "0.5rem" }}>
          <i className="uil uil-arrow-left"></i> View Portfolio
        </button>

        <button className="admin__logout-btn" onClick={handleLogout}>
          <i className="uil uil-sign-out-alt"></i> Log Out
        </button>
      </div>

      {/* Main Content Area */}
      <div className="admin__content">
        {/* TAB 1: HOME & ABOUT */}
        {activeTab === "home-about" && (
          <div>
            <div className="admin__content-header">
              <div>
                <h2 className="admin__content-title">Home & About Sections</h2>
                <span className="admin__content-subtitle">Manage text descriptions and counters</span>
              </div>
            </div>

            <form onSubmit={handleSaveHomeAbout} className="admin__form-card">
              <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1.5rem" }}>Home Content</h3>
              <div className="admin__form-grid">
                <div className="admin__form-group">
                  <label className="admin__form-label">Full Name</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    value={homeName}
                    onChange={(e) => setHomeName(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Sub-headline / Title</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    value={homeSubtitle}
                    onChange={(e) => setHomeSubtitle(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">Short Description</label>
                  <textarea
                    className="admin__form-textarea"
                    value={homeDescription}
                    onChange={(e) => setHomeDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              <h3 className="admin__form-title" style={{ textAlign: "left", margin: "2rem 0 1.5rem" }}>About Content</h3>
              <div className="admin__form-grid">
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">Introduction / Biography</label>
                  <textarea
                    className="admin__form-textarea"
                    value={aboutDescription}
                    onChange={(e) => setAboutDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Experience Years Badge text</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    value={aboutExpYears}
                    onChange={(e) => setAboutExpYears(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Completed Projects Badge text</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    value={aboutProjects}
                    onChange={(e) => setAboutProjects(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Support availability badge text</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    value={aboutSupport}
                    onChange={(e) => setAboutSupport(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">CV / Resume PDF (URL or File Upload)</label>
                  <div style={{ display: "flex", columnGap: "0.5rem" }}>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="PDF URL or Local Upload"
                      value={aboutCvUrl.startsWith("data:application/pdf") ? "Local PDF File Uploaded" : aboutCvUrl}
                      onChange={(e) => setAboutCvUrl(e.target.value)}
                      disabled={aboutCvUrl.startsWith("data:application/pdf")}
                      style={{ flexGrow: 1 }}
                    />
                    <label className="memories__form-file-label" style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap", cursor: "pointer" }}>
                      <i className="uil uil-upload-alt"></i> Upload PDF
                      <input
                        type="file"
                        accept="application/pdf"
                        style={{ display: "none" }}
                        onChange={handlePdfUpload}
                      />
                    </label>
                    {aboutCvUrl && (
                      <button 
                        type="button" 
                        className="admin__action-btn admin__action-btn--delete" 
                        onClick={() => setAboutCvUrl("")} 
                        style={{ height: "100%", width: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Remove PDF"
                      >
                        <i className="uil uil-trash-alt"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <button type="submit" className="admin__btn admin__btn--primary" style={{ marginTop: "1rem" }}>
                Save Text Updates
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: SKILLS & JOURNEY */}
        {activeTab === "skills-qual" && (
          <div>
            <div className="admin__content-header">
              <div>
                <h2 className="admin__content-title">Skills & Journey Timeline</h2>
                <span className="admin__content-subtitle">Manage languages, tools, and qualification markers</span>
              </div>
            </div>

            {/* Skills grid split */}
            <div className="admin__skills-section">
              {/* Frontend Skills List */}
              <div className="admin__skills-card">
                <h3 className="admin__form-title" style={{ textAlign: "left", fontSize: "1.1rem" }}>Frontend Skills</h3>
                <div className="admin__table-container">
                  <table className="admin__table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}></th>
                        <th>Skill</th>
                        <th>Level</th>
                        <th style={{ width: "60px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioData.skills.frontend.map((s, idx) => {
                        const isEditing = editingSkillKey === `frontend-${s.name}`;
                        return (
                          <tr
                            key={idx}
                            draggable={!isEditing}
                            onDragStart={() => !isEditing && handleDragStart(idx, "frontend-skills")}
                            onDragOver={(e) => !isEditing && handleDragOver(e, idx, "frontend-skills")}
                            onDragEnd={handleDragEnd}
                            className={draggedIndex === idx && dragSource === "frontend-skills" ? "admin__table-row--dragging" : ""}
                          >
                            <td style={{ textAlign: "center" }}>
                              <i className="uil uil-draggabled" style={{ cursor: isEditing ? "not-allowed" : "grab", color: "var(--font-color)" }}></i>
                            </td>
                            {isEditing ? (
                              <>
                                <td>
                                  <input
                                    type="text"
                                    className="admin__form-input"
                                    value={editSkillName}
                                    onChange={(e) => setEditSkillName(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                    required
                                  />
                                </td>
                                <td>
                                  <select
                                    className="admin__form-select"
                                    value={editSkillLevel}
                                    onChange={(e) => setEditSkillLevel(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem", height: "auto" }}
                                  >
                                    <option value="Basic">Basic</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                  </select>
                                </td>
                                <td>
                                  <div style={{ display: "flex", columnGap: "0.25rem" }}>
                                    <button
                                      type="button"
                                      className="admin__action-btn"
                                      onClick={() => handleSaveSkillEdit("frontend", s.name)}
                                      style={{ color: "var(--green-color)" }}
                                      title="Save"
                                    >
                                      <i className="uil uil-check"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="admin__action-btn"
                                      onClick={handleCancelSkillEdit}
                                      style={{ color: "red" }}
                                      title="Cancel"
                                    >
                                      <i className="uil uil-multiply"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{s.name}</td>
                                <td>{s.level}</td>
                                <td>
                                  <div style={{ display: "flex", columnGap: "0.25rem" }}>
                                    <button
                                      type="button"
                                      className="admin__action-btn admin__action-btn--edit"
                                      onClick={() => startEditSkill("frontend", s)}
                                      title="Edit"
                                    >
                                      <i className="uil uil-edit"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="admin__action-btn admin__action-btn--delete"
                                      onClick={() => handleDeleteSkill("frontend", s.name)}
                                      title="Delete"
                                    >
                                      <i className="uil uil-trash-alt"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Backend Skills List */}
              <div className="admin__skills-card">
                <h3 className="admin__form-title" style={{ textAlign: "left", fontSize: "1.1rem" }}>Backend Skills</h3>
                <div className="admin__table-container">
                  <table className="admin__table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}></th>
                        <th>Skill</th>
                        <th>Level</th>
                        <th style={{ width: "60px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioData.skills.backend.map((s, idx) => {
                        const isEditing = editingSkillKey === `backend-${s.name}`;
                        return (
                          <tr
                            key={idx}
                            draggable={!isEditing}
                            onDragStart={() => !isEditing && handleDragStart(idx, "backend-skills")}
                            onDragOver={(e) => !isEditing && handleDragOver(e, idx, "backend-skills")}
                            onDragEnd={handleDragEnd}
                            className={draggedIndex === idx && dragSource === "backend-skills" ? "admin__table-row--dragging" : ""}
                          >
                            <td style={{ textAlign: "center" }}>
                              <i className="uil uil-draggabled" style={{ cursor: isEditing ? "not-allowed" : "grab", color: "var(--font-color)" }}></i>
                            </td>
                            {isEditing ? (
                              <>
                                <td>
                                  <input
                                    type="text"
                                    className="admin__form-input"
                                    value={editSkillName}
                                    onChange={(e) => setEditSkillName(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                    required
                                  />
                                </td>
                                <td>
                                  <select
                                    className="admin__form-select"
                                    value={editSkillLevel}
                                    onChange={(e) => setEditSkillLevel(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem", height: "auto" }}
                                  >
                                    <option value="Basic">Basic</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                  </select>
                                </td>
                                <td>
                                  <div style={{ display: "flex", columnGap: "0.25rem" }}>
                                    <button
                                      type="button"
                                      className="admin__action-btn"
                                      onClick={() => handleSaveSkillEdit("backend", s.name)}
                                      style={{ color: "var(--green-color)" }}
                                      title="Save"
                                    >
                                      <i className="uil uil-check"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="admin__action-btn"
                                      onClick={handleCancelSkillEdit}
                                      style={{ color: "red" }}
                                      title="Cancel"
                                    >
                                      <i className="uil uil-multiply"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{s.name}</td>
                                <td>{s.level}</td>
                                <td>
                                  <div style={{ display: "flex", columnGap: "0.25rem" }}>
                                    <button
                                      type="button"
                                      className="admin__action-btn admin__action-btn--edit"
                                      onClick={() => startEditSkill("backend", s)}
                                      title="Edit"
                                    >
                                      <i className="uil uil-edit"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="admin__action-btn admin__action-btn--delete"
                                      onClick={() => handleDeleteSkill("backend", s.name)}
                                      title="Delete"
                                    >
                                      <i className="uil uil-trash-alt"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Add Skill form */}
            <form onSubmit={handleAddSkill} className="admin__form-card" style={{ marginTop: "2rem" }}>
              <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem" }}>Add New Skill</h3>
              <div className="admin__form-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                <div className="admin__form-group">
                  <label className="admin__form-label">Skill Name</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="e.g. Kotlin"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Skill Level</label>
                  <select
                    className="admin__form-select"
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Skill Type</label>
                  <select
                    className="admin__form-select"
                    value={skillType}
                    onChange={(e) => setSkillType(e.target.value as any)}
                  >
                    <option value="frontend">Frontend Skill</option>
                    <option value="backend">Backend Skill</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="admin__btn admin__btn--primary">
                Add Skill
              </button>
            </form>

            {/* Qualifications Timeline management */}
            <div className="admin__skills-section" style={{ marginTop: "2rem" }}>
              {/* Education List */}
              <div className="admin__skills-card">
                <h3 className="admin__form-title" style={{ textAlign: "left", fontSize: "1.1rem" }}>Education Timeline</h3>
                <div className="admin__table-container">
                  <table className="admin__table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}></th>
                        <th>Title</th>
                        <th>Subtitle</th>
                        <th>Calendar</th>
                        <th style={{ width: "60px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioData.qualification.education.map((q, idx) => {
                        const isEditing = editingQualId === q.id;
                        return (
                          <tr
                            key={q.id}
                            draggable={!isEditing}
                            onDragStart={() => !isEditing && handleDragStart(idx, "education")}
                            onDragOver={(e) => !isEditing && handleDragOver(e, idx, "education")}
                            onDragEnd={handleDragEnd}
                            className={draggedIndex === idx && dragSource === "education" ? "admin__table-row--dragging" : ""}
                          >
                            <td style={{ textAlign: "center" }}>
                              <i className="uil uil-draggabled" style={{ cursor: isEditing ? "not-allowed" : "grab", color: "var(--font-color)" }}></i>
                            </td>
                            {isEditing ? (
                              <>
                                <td>
                                  <input
                                    type="text"
                                    className="admin__form-input"
                                    value={editQualTitle}
                                    onChange={(e) => setEditQualTitle(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="admin__form-input"
                                    value={editQualSubtitle}
                                    onChange={(e) => setEditQualSubtitle(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="admin__form-input"
                                    value={editQualCalendar}
                                    onChange={(e) => setEditQualCalendar(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                    required
                                  />
                                </td>
                                <td>
                                  <div style={{ display: "flex", columnGap: "0.25rem" }}>
                                    <button
                                      type="button"
                                      className="admin__action-btn"
                                      onClick={() => handleSaveQualificationEdit("education", q.id)}
                                      style={{ color: "var(--green-color)" }}
                                      title="Save"
                                    >
                                      <i className="uil uil-check"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="admin__action-btn"
                                      onClick={handleCancelQualificationEdit}
                                      style={{ color: "red" }}
                                      title="Cancel"
                                    >
                                      <i className="uil uil-multiply"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{q.title}</td>
                                <td>{q.subtitle}</td>
                                <td>{q.calendar}</td>
                                <td>
                                  <div style={{ display: "flex", columnGap: "0.25rem" }}>
                                    <button
                                      type="button"
                                      className="admin__action-btn admin__action-btn--edit"
                                      onClick={() => startEditQualification(q)}
                                      title="Edit"
                                    >
                                      <i className="uil uil-edit"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="admin__action-btn admin__action-btn--delete"
                                      onClick={() => handleDeleteQualification("education", q.id)}
                                      title="Delete"
                                    >
                                      <i className="uil uil-trash-alt"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Experience List */}
              <div className="admin__skills-card">
                <h3 className="admin__form-title" style={{ textAlign: "left", fontSize: "1.1rem" }}>Experience Timeline</h3>
                <div className="admin__table-container">
                  <table className="admin__table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}></th>
                        <th>Title</th>
                        <th>Subtitle</th>
                        <th>Calendar</th>
                        <th style={{ width: "60px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioData.qualification.experience.map((q, idx) => {
                        const isEditing = editingQualId === q.id;
                        return (
                          <tr
                            key={q.id}
                            draggable={!isEditing}
                            onDragStart={() => !isEditing && handleDragStart(idx, "experience")}
                            onDragOver={(e) => !isEditing && handleDragOver(e, idx, "experience")}
                            onDragEnd={handleDragEnd}
                            className={draggedIndex === idx && dragSource === "experience" ? "admin__table-row--dragging" : ""}
                          >
                            <td style={{ textAlign: "center" }}>
                              <i className="uil uil-draggabled" style={{ cursor: isEditing ? "not-allowed" : "grab", color: "var(--font-color)" }}></i>
                            </td>
                            {isEditing ? (
                              <>
                                <td>
                                  <input
                                    type="text"
                                    className="admin__form-input"
                                    value={editQualTitle}
                                    onChange={(e) => setEditQualTitle(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="admin__form-input"
                                    value={editQualSubtitle}
                                    onChange={(e) => setEditQualSubtitle(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="admin__form-input"
                                    value={editQualCalendar}
                                    onChange={(e) => setEditQualCalendar(e.target.value)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                                    required
                                  />
                                </td>
                                <td>
                                  <div style={{ display: "flex", columnGap: "0.25rem" }}>
                                    <button
                                      type="button"
                                      className="admin__action-btn"
                                      onClick={() => handleSaveQualificationEdit("experience", q.id)}
                                      style={{ color: "var(--green-color)" }}
                                      title="Save"
                                    >
                                      <i className="uil uil-check"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="admin__action-btn"
                                      onClick={handleCancelQualificationEdit}
                                      style={{ color: "red" }}
                                      title="Cancel"
                                    >
                                      <i className="uil uil-multiply"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{q.title}</td>
                                <td>{q.subtitle}</td>
                                <td>{q.calendar}</td>
                                <td>
                                  <div style={{ display: "flex", columnGap: "0.25rem" }}>
                                    <button
                                      type="button"
                                      className="admin__action-btn admin__action-btn--edit"
                                      onClick={() => startEditQualification(q)}
                                      title="Edit"
                                    >
                                      <i className="uil uil-edit"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="admin__action-btn admin__action-btn--delete"
                                      onClick={() => handleDeleteQualification("experience", q.id)}
                                      title="Delete"
                                    >
                                      <i className="uil uil-trash-alt"></i>
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Add Qualification form */}
            <form onSubmit={handleAddQualification} className="admin__form-card" style={{ marginTop: "2rem" }}>
              <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem" }}>Add Qualification Timeline Marker</h3>
              <div className="admin__form-grid">
                <div className="admin__form-group">
                  <label className="admin__form-label">Degree / Job Title</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="e.g. BCA 2nd - 750"
                    value={qTitle}
                    onChange={(e) => setQTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Institution / Organization</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="e.g. Seth GB Podar College"
                    value={qSubtitle}
                    onChange={(e) => setQSubtitle(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Calendar / Dates</label>
                  <input
                    type="text"
                    className="admin__form-input"
                    placeholder="e.g. 2023 - 24"
                    value={qCalendar}
                    onChange={(e) => setQCalendar(e.target.value)}
                    required
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Category</label>
                  <select
                    className="admin__form-select"
                    value={qType}
                    onChange={(e) => setQType(e.target.value as any)}
                  >
                    <option value="education">Education Timeline</option>
                    <option value="experience">Experience Timeline</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="admin__btn admin__btn--primary">
                Add Timeline Marker
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: PROJECTS */}
        {activeTab === "projects" && (
          <div>
            <div className="admin__content-header">
              <div>
                <h2 className="admin__content-title">Projects Portfolio</h2>
                <span className="admin__content-subtitle">Manage cases, project cards, and redirect code links</span>
              </div>
            </div>

            {/* Edit Project Form (Only displayed when editing) */}
            {editingId && (
              <form onSubmit={handleEditProject} className="admin__form-card" style={{ borderColor: "var(--title-color)" }}>
                <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem", color: "var(--title-color)" }}>
                  <i className="uil uil-edit"></i> Edit Project
                </h3>
                <div className="admin__form-grid">
                  <div className="admin__form-group">
                    <label className="admin__form-label">Project Title *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. E-Commerce Platform"
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Category *</label>
                    <select
                      className="admin__form-select"
                      value={projCategory}
                      onChange={(e) => setProjCategory(e.target.value)}
                      required
                    >
                      <option value="Web App">Web App</option>
                      <option value="Android App">Android App</option>
                      <option value="Softwares">Softwares</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                    </select>
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Demo URL</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. http://example.com"
                      value={projDemo}
                      onChange={(e) => setProjDemo(e.target.value)}
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Buy URL</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. Buy Me A Coffee product link"
                      value={projBuy}
                      onChange={(e) => setProjBuy(e.target.value)}
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">GitHub URL</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. GitHub link"
                      value={projGithub}
                      onChange={(e) => setProjGithub(e.target.value)}
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Project Cover Image (URL or Upload File)</label>
                    <div style={{ display: "flex", columnGap: "0.5rem" }}>
                      <input
                        type="text"
                        className="admin__form-input"
                        placeholder="Image URL"
                        value={projImage.startsWith("data:") ? "Local File Uploaded" : projImage}
                        onChange={(e) => setProjImage(e.target.value)}
                        disabled={projImage.startsWith("data:")}
                        style={{ flexGrow: 1 }}
                      />
                      <label className="memories__form-file-label">
                        <i className="uil uil-upload-alt"></i> Upload
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageUpload(e, setProjImage)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="admin__form-buttons" style={{ display: "flex", columnGap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" className="admin__btn admin__btn--primary">
                    Save Changes
                  </button>
                  <button type="button" className="admin__btn admin__btn--secondary" onClick={resetProjectForm}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Projects Table */}
            <div className="admin__table-container">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}></th>
                    <th style={{ width: "80px" }}>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Links</th>
                    <th style={{ width: "100px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.projects.map((p, idx) => (
                    <tr
                      key={p.id}
                      draggable
                      onDragStart={() => handleDragStart(idx, "projects")}
                      onDragOver={(e) => handleDragOver(e, idx, "projects")}
                      onDragEnd={handleDragEnd}
                      className={draggedIndex === idx && dragSource === "projects" ? "admin__table-row--dragging" : ""}
                    >
                      <td style={{ textAlign: "center" }}>
                        <i className="uil uil-draggabled" style={{ cursor: "grab", color: "var(--font-color)" }}></i>
                      </td>
                      <td>
                        <img src={p.image} alt={p.title} className="admin__table-img" />
                      </td>
                      <td>{p.title}</td>
                      <td>{p.category}</td>
                      <td>
                        <div style={{ display: "flex", columnGap: "0.5rem", fontSize: "1.2rem" }}>
                          {p.demo && (
                            <a href={p.demo} target="_blank" rel="noopener noreferrer">
                              <i className="uil uil-external-link-alt" title="Demo"></i>
                            </a>
                          )}
                          {p.github && (
                            <a href={p.github} target="_blank" rel="noopener noreferrer">
                              <i className="uil uil-github" title="GitHub"></i>
                            </a>
                          )}
                          {p.buy && (
                            <a href={p.buy} target="_blank" rel="noopener noreferrer">
                              <i className="uil uil-coffee" title="Buy link"></i>
                            </a>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="admin__table-actions">
                          <button
                            className="admin__action-btn admin__action-btn--edit"
                            onClick={() => startEditProject(p)}
                          >
                            <i className="uil uil-edit"></i>
                          </button>
                          <button
                            className="admin__action-btn admin__action-btn--delete"
                            onClick={() => handleDeleteProject(p.id)}
                          >
                            <i className="uil uil-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Project Form (Always visible at the bottom unless editing) */}
            {!editingId && (
              <form onSubmit={handleAddProject} className="admin__form-card" style={{ marginTop: "2rem" }}>
                <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem" }}>
                  <i className="uil uil-plus"></i> Add New Project
                </h3>
                <div className="admin__form-grid">
                  <div className="admin__form-group">
                    <label className="admin__form-label">Project Title *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. E-Commerce Platform"
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Category *</label>
                    <select
                      className="admin__form-select"
                      value={projCategory}
                      onChange={(e) => setProjCategory(e.target.value)}
                      required
                    >
                      <option value="Web App">Web App</option>
                      <option value="Android App">Android App</option>
                      <option value="Softwares">Softwares</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                    </select>
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Demo URL</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. http://example.com"
                      value={projDemo}
                      onChange={(e) => setProjDemo(e.target.value)}
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Buy URL</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. Buy Me A Coffee product link"
                      value={projBuy}
                      onChange={(e) => setProjBuy(e.target.value)}
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">GitHub URL</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. GitHub link"
                      value={projGithub}
                      onChange={(e) => setProjGithub(e.target.value)}
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Project Cover Image (URL or Upload File)</label>
                    <div style={{ display: "flex", columnGap: "0.5rem" }}>
                      <input
                        type="text"
                        className="admin__form-input"
                        placeholder="Image URL"
                        value={projImage.startsWith("data:") ? "Local File Uploaded" : projImage}
                        onChange={(e) => setProjImage(e.target.value)}
                        disabled={projImage.startsWith("data:")}
                        style={{ flexGrow: 1 }}
                      />
                      <label className="memories__form-file-label">
                        <i className="uil uil-upload-alt"></i> Upload
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageUpload(e, setProjImage)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <button type="submit" className="admin__btn admin__btn--primary" style={{ marginTop: "1rem" }}>
                  <i className="uil uil-plus-circle"></i> Create Project
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 4: TESTIMONIALS */}
        {activeTab === "testimonials" && (
          <div>
            <div className="admin__content-header">
              <div>
                <h2 className="admin__content-title">Clients Testimonials</h2>
                <span className="admin__content-subtitle">Manage client reviews and ratings</span>
              </div>
            </div>

            {/* Edit Testimonial Form (Only displayed when editing) */}
            {editingId && (
              <form onSubmit={handleEditTestimonial} className="admin__form-card" style={{ borderColor: "var(--title-color)" }}>
                <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem", color: "var(--title-color)" }}>
                  <i className="uil uil-edit"></i> Edit Testimonial
                </h3>
                <div className="admin__form-grid">
                  <div className="admin__form-group">
                    <label className="admin__form-label">Client Name *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. John Doe"
                      value={tstTitle}
                      onChange={(e) => setTstTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Client Avatar (URL or File Upload)</label>
                    <div style={{ display: "flex", columnGap: "0.5rem" }}>
                      <input
                        type="text"
                        className="admin__form-input"
                        placeholder="Image URL"
                        value={tstImage.startsWith("data:") ? "Local File Uploaded" : tstImage}
                        onChange={(e) => setTstImage(e.target.value)}
                        disabled={tstImage.startsWith("data:")}
                        style={{ flexGrow: 1 }}
                      />
                      <label className="memories__form-file-label">
                        <i className="uil uil-upload-alt"></i> Upload
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageUpload(e, setTstImage)}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="admin__form-group admin__form-group--full">
                    <label className="admin__form-label">Client Review / Description *</label>
                    <textarea
                      className="admin__form-textarea"
                      placeholder="Write review here..."
                      value={tstDescription}
                      onChange={(e) => setTstDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="admin__form-buttons" style={{ display: "flex", columnGap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" className="admin__btn admin__btn--primary">
                    Save Changes
                  </button>
                  <button type="button" className="admin__btn admin__btn--secondary" onClick={resetTestimonialForm}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Testimonials Table */}
            <div className="admin__table-container">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}></th>
                    <th style={{ width: "80px" }}>Avatar</th>
                    <th>Client Name</th>
                    <th>Review</th>
                    <th style={{ width: "100px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.testimonials.map((t, idx) => (
                    <tr
                      key={t.id}
                      draggable
                      onDragStart={() => handleDragStart(idx, "testimonials")}
                      onDragOver={(e) => handleDragOver(e, idx, "testimonials")}
                      onDragEnd={handleDragEnd}
                      className={draggedIndex === idx && dragSource === "testimonials" ? "admin__table-row--dragging" : ""}
                    >
                      <td style={{ textAlign: "center" }}>
                        <i className="uil uil-draggabled" style={{ cursor: "grab", color: "var(--font-color)" }}></i>
                      </td>
                      <td>
                        <img src={t.image} alt={t.title} className="admin__table-img" style={{ borderRadius: "50%" }} />
                      </td>
                      <td>{t.title}</td>
                      <td>
                        <p style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4 }}>
                          {t.description}
                        </p>
                      </td>
                      <td>
                        <div className="admin__table-actions">
                          <button
                            className="admin__action-btn admin__action-btn--edit"
                            onClick={() => startEditTestimonial(t)}
                          >
                            <i className="uil uil-edit"></i>
                          </button>
                          <button
                            className="admin__action-btn admin__action-btn--delete"
                            onClick={() => handleDeleteTestimonial(t.id)}
                          >
                            <i className="uil uil-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Testimonial Form (Always visible at the bottom unless editing) */}
            {!editingId && (
              <form onSubmit={handleAddTestimonial} className="admin__form-card" style={{ marginTop: "2rem" }}>
                <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem" }}>
                  <i className="uil uil-plus"></i> Add New Testimonial
                </h3>
                <div className="admin__form-grid">
                  <div className="admin__form-group">
                    <label className="admin__form-label">Client Name *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. John Doe"
                      value={tstTitle}
                      onChange={(e) => setTstTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Client Avatar (URL or File Upload)</label>
                    <div style={{ display: "flex", columnGap: "0.5rem" }}>
                      <input
                        type="text"
                        className="admin__form-input"
                        placeholder="Image URL"
                        value={tstImage.startsWith("data:") ? "Local File Uploaded" : tstImage}
                        onChange={(e) => setTstImage(e.target.value)}
                        disabled={tstImage.startsWith("data:")}
                        style={{ flexGrow: 1 }}
                      />
                      <label className="memories__form-file-label">
                        <i className="uil uil-upload-alt"></i> Upload
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageUpload(e, setTstImage)}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="admin__form-group admin__form-group--full">
                    <label className="admin__form-label">Client Review / Description *</label>
                    <textarea
                      className="admin__form-textarea"
                      placeholder="Write review here..."
                      value={tstDescription}
                      onChange={(e) => setTstDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <button type="submit" className="admin__btn admin__btn--primary" style={{ marginTop: "1rem" }}>
                  <i className="uil uil-plus-circle"></i> Create Testimonial
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 5: MEMORIES */}
        {activeTab === "memories" && (
          <div>
            <div className="admin__content-header">
              <div>
                <h2 className="admin__content-title">Special Memories</h2>
                <span className="admin__content-subtitle">Manage timeline event photo groups</span>
              </div>
            </div>

            {/* Edit Memory Form (Only displayed when editing) */}
            {editingId && (
              <form onSubmit={handleEditMemory} className="admin__form-card" style={{ borderColor: "var(--title-color)" }}>
                <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem", color: "var(--title-color)" }}>
                  <i className="uil uil-edit"></i> Edit Event Memory
                </h3>
                <div className="admin__form-grid">
                  <div className="admin__form-group">
                    <label className="admin__form-label">Event Title *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. Hackathon Final"
                      value={memTitle}
                      onChange={(e) => setMemTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Date *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. March 2024"
                      value={memDate}
                      onChange={(e) => setMemDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Category Group</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. College, Hackathons"
                      value={memCategory}
                      onChange={(e) => setMemCategory(e.target.value)}
                    />
                  </div>
                  <div className="admin__form-group admin__form-group--full">
                    <label className="admin__form-label">Event Description *</label>
                    <textarea
                      className="admin__form-textarea"
                      placeholder="Write brief description..."
                      value={memDescription}
                      onChange={(e) => setMemDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {/* Multiple image list inputs */}
                  <div className="admin__form-group admin__form-group--full">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <label className="admin__form-label">Event Photos List</label>
                      <button
                        type="button"
                        className="memories__form-add-photo-btn"
                        onClick={() => setMemImages([...memImages, ""])}
                      >
                        <i className="uil uil-plus-circle"></i> Add Image field
                      </button>
                    </div>

                    <div className="memories__form-photos-list">
                      {memImages.map((val, idx) => (
                        <div className="memories__form-photo-row" key={idx}>
                          <input
                            type="text"
                            className="admin__form-input"
                            placeholder="Image URL"
                            value={val.startsWith("data:") ? "Local File Uploaded" : val}
                            onChange={(e) => {
                              const updated = [...memImages];
                              updated[idx] = e.target.value;
                              setMemImages(updated);
                            }}
                            disabled={val.startsWith("data:")}
                            style={{ flexGrow: 1 }}
                          />
                          <label className="memories__form-file-label">
                            <i className="uil uil-upload-alt"></i> Upload
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => handleMemoryImageUpload(e, idx)}
                            />
                          </label>

                          {memImages.length > 1 && (
                            <i
                              className="uil uil-trash-alt memories__form-photo-remove"
                              onClick={() => setMemImages(memImages.filter((_, i) => i !== idx))}
                            ></i>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="admin__form-buttons" style={{ display: "flex", columnGap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" className="admin__btn admin__btn--primary">
                    Save Changes
                  </button>
                  <button type="button" className="admin__btn admin__btn--secondary" onClick={resetMemoryForm}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Memories Table */}
            <div className="admin__table-container">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}></th>
                    <th style={{ width: "80px" }}>Cover</th>
                    <th>Event Title</th>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Photos Count</th>
                    <th style={{ width: "100px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.memories.map((m, idx) => (
                    <tr
                      key={m.id}
                      draggable
                      onDragStart={() => handleDragStart(idx, "memories")}
                      onDragOver={(e) => handleDragOver(e, idx, "memories")}
                      onDragEnd={handleDragEnd}
                      className={draggedIndex === idx && dragSource === "memories" ? "admin__table-row--dragging" : ""}
                    >
                      <td style={{ textAlign: "center" }}>
                        <i className="uil uil-draggabled" style={{ cursor: "grab", color: "var(--font-color)" }}></i>
                      </td>
                      <td>
                        <img src={m.images[0]} alt={m.title} className="admin__table-img" />
                      </td>
                      <td>{m.title}</td>
                      <td>{m.date}</td>
                      <td>{m.category}</td>
                      <td>
                        <i className="uil uil-images"></i> {m.images.length}
                      </td>
                      <td>
                        <div className="admin__table-actions">
                          <button
                            className="admin__action-btn admin__action-btn--edit"
                            onClick={() => startEditMemory(m)}
                          >
                            <i className="uil uil-edit"></i>
                          </button>
                          <button
                            className="admin__action-btn admin__action-btn--delete"
                            onClick={() => handleDeleteMemory(m.id)}
                          >
                            <i className="uil uil-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Memory Form (Always visible at the bottom unless editing) */}
            {!editingId && (
              <form onSubmit={handleAddMemory} className="admin__form-card" style={{ marginTop: "2rem" }}>
                <h3 className="admin__form-title" style={{ textAlign: "left", marginBottom: "1rem" }}>
                  <i className="uil uil-plus"></i> Add New Event Memory
                </h3>
                <div className="admin__form-grid">
                  <div className="admin__form-group">
                    <label className="admin__form-label">Event Title *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. Hackathon Final"
                      value={memTitle}
                      onChange={(e) => setMemTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Date *</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. March 2024"
                      value={memDate}
                      onChange={(e) => setMemDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin__form-group">
                    <label className="admin__form-label">Category Group</label>
                    <input
                      type="text"
                      className="admin__form-input"
                      placeholder="e.g. College, Hackathons"
                      value={memCategory}
                      onChange={(e) => setMemCategory(e.target.value)}
                    />
                  </div>
                  <div className="admin__form-group admin__form-group--full">
                    <label className="admin__form-label">Event Description *</label>
                    <textarea
                      className="admin__form-textarea"
                      placeholder="Write brief description..."
                      value={memDescription}
                      onChange={(e) => setMemDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {/* Multiple image list inputs */}
                  <div className="admin__form-group admin__form-group--full">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <label className="admin__form-label">Event Photos List</label>
                      <button
                        type="button"
                        className="memories__form-add-photo-btn"
                        onClick={() => setMemImages([...memImages, ""])}
                      >
                        <i className="uil uil-plus-circle"></i> Add Image field
                      </button>
                    </div>

                    <div className="memories__form-photos-list">
                      {memImages.map((val, idx) => (
                        <div className="memories__form-photo-row" key={idx}>
                          <input
                            type="text"
                            className="admin__form-input"
                            placeholder="Image URL"
                            value={val.startsWith("data:") ? "Local File Uploaded" : val}
                            onChange={(e) => {
                              const updated = [...memImages];
                              updated[idx] = e.target.value;
                              setMemImages(updated);
                            }}
                            disabled={val.startsWith("data:")}
                            style={{ flexGrow: 1 }}
                          />
                          <label className="memories__form-file-label">
                            <i className="uil uil-upload-alt"></i> Upload
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => handleMemoryImageUpload(e, idx)}
                            />
                          </label>

                          {memImages.length > 1 && (
                            <i
                              className="uil uil-trash-alt memories__form-photo-remove"
                              onClick={() => setMemImages(memImages.filter((_, i) => i !== idx))}
                            ></i>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button type="submit" className="admin__btn admin__btn--primary" style={{ marginTop: "1rem" }}>
                  <i className="uil uil-plus-circle"></i> Create Event Memory
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
