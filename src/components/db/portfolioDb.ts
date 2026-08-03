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

export interface PortfolioData {
  home: {
    name: string;
    subtitle: string;
    description: string;
  };
  about: {
    description: string;
    experienceYears: string;
    completedProjects: string;
    supportAvailability: string;
    cvUrl?: string;
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
}

// Default initial data structure (empty template)
export const initialPortfolioData: PortfolioData = {
  home: {
    name: "",
    subtitle: "",
    description: ""
  },
  about: {
    description: "",
    experienceYears: "",
    completedProjects: "",
    supportAvailability: "",
    cvUrl: ""
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
  memories: []
};
