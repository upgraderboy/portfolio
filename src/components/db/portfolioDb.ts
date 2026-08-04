export interface SkillItem {
  name: string;
  level: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  modalTitle: string;
  modalDescription: string;
  points: { id: string; text: string; link?: string }[];
}

export interface QualificationItem {
  id: string;
  title: string;
  subtitle: string;
  calendar: string;
}

export interface ProjectItem {
  id: string;
  image: string;
  title: string;
  category: string;
  demo?: string;
  buy?: string;
  github?: string;
}

export interface TestimonialItem {
  id: string;
  image: string;
  title: string;
  description: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  images: string[];
}

export interface BlogItem {
  id: string;
  title: string;
  content: string; // Tiptap content
  date: string;
  coverImage?: string;
  status?: "public" | "draft";
}

export interface PortfolioData {
  home: {
    name: string;
    subtitle: string;
    description: string;
    imageUrl?: string;
  };
  about: {
    description: string;
    experienceYears: string;
    completedProjects: string;
    supportAvailability: string;
    cvUrl?: string;
    imageUrl?: string;
  };
  skills: {
    frontend: SkillItem[];
    backend: SkillItem[];
  };
  services: ServiceItem[];
  qualification: {
    education: QualificationItem[];
    experience: QualificationItem[];
  };
  projects: ProjectItem[];
  testimonials: TestimonialItem[];
  memories: MemoryItem[];
  blogs?: BlogItem[];
  seo?: SeoConfig;
  resources?: ResourceItem[];
  resourceCategories?: ResourceCategory[];
}

export interface ResourceCategory {
  id: string;
  name: string;
  subcategories: string[];
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  category: string;
  subcategory?: string;
  tags: string[];
  source?: string;
  dateAdded: string;
}

export interface SeoRouteItem {
  id: string;
  path: string;
  title: string;
  description: string;
}

export interface SeoConfig {
  siteTitle: string;
  siteDescription: string;
  routes: SeoRouteItem[];
  faviconUrl?: string;
}

// Default initial data structure (empty template)
export const initialPortfolioData: PortfolioData = {
  home: {
    name: "",
    subtitle: "",
    description: "",
    imageUrl: ""
  },
  about: {
    description: "",
    experienceYears: "",
    completedProjects: "",
    supportAvailability: "",
    cvUrl: "",
    imageUrl: ""
  },
  skills: {
    frontend: [],
    backend: []
  },
  services: [],
  qualification: {
    education: [],
    experience: []
  },
  projects: [],
  testimonials: [],
  memories: [],
  blogs: [],
  seo: {
    siteTitle: "Upgrader Boy",
    siteDescription: "Tech. That Makes Trends",
    faviconUrl: "",
    routes: [
      { id: "blogs", path: "/blogs", title: "Blogs", description: "All Tech Blogs from Upgrader Boy" },
      { id: "projects", path: "/projects", title: "Projects", description: "All Projects developed by Upgrader Boy" },
      { id: "memories", path: "/memories", title: "Memories", description: "Cool Memories of Upgrader Boy in his Tech Journey" },
      { id: "resources", path: "/resources", title: "Resources", description: "All Tech Resources by Upgrader Boy" }
    ]
  },
  resources: [],
  resourceCategories: [
    { id: "cat-books", name: "Books", subcategories: ["Computer Science", "Programming", "System Design"] },
    { id: "cat-notes", name: "Notes", subcategories: ["DSA", "Operating Systems", "Computer Networks"] },
    { id: "cat-papers", name: "Exam Papers", subcategories: ["GATE", "University Exams"] }
  ]
};
