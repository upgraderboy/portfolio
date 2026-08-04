import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, query, limit } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { initialPortfolioData, PortfolioData } from "./portfolioDb";

interface PortfolioContextType {
  portfolioData: PortfolioData;
  isLoading: boolean;
  updateHomeAbout: (homeData: PortfolioData["home"], aboutData: PortfolioData["about"]) => void;
  updateSkills: (skillsData: PortfolioData["skills"]) => void;
  updateServices: (servicesData: PortfolioData["services"]) => void;
  updateQualification: (qualificationData: PortfolioData["qualification"]) => void;
  updateProjects: (projectsData: PortfolioData["projects"]) => void;
  updateTestimonials: (testimonialsData: PortfolioData["testimonials"]) => void;
  updateMemories: (memoriesData: PortfolioData["memories"]) => void;
  updateBlogs: (blogsData: NonNullable<PortfolioData["blogs"]>) => void;
  updateSeo: (seoData: NonNullable<PortfolioData["seo"]>) => void;
  
  // Dynamic query optimized fetchers
  fetchProjects: (limitCount?: number) => Promise<any[]>;
  fetchMemories: (limitCount?: number) => Promise<any[]>;
  fetchBlogs: (limitCount?: number) => Promise<any[]>;
  fetchBlogPost: (id: string) => Promise<any | null>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => {
    const cached = localStorage.getItem("portfolio_cached_data");
    if (cached) {
      try {
        const data = JSON.parse(cached);
        console.log("Portfolio data restored instantly from local cache.");
        return data;
      } catch (e) {
        return initialPortfolioData;
      }
    }
    return initialPortfolioData;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      if (isFirebaseConfigured && db) {
        try {
          const docRef = doc(db, "portfolio_config", "data");
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as PortfolioData;
            // Merge loaded data with initial schema structure to prevent errors from missing keys
            const merged = {
              ...initialPortfolioData,
              ...data,
              home: { ...initialPortfolioData.home, ...data.home },
              about: { ...initialPortfolioData.about, ...data.about },
              skills: { ...initialPortfolioData.skills, ...data.skills },
              qualification: { ...initialPortfolioData.qualification, ...data.qualification },
              services: data.services || initialPortfolioData.services,
              projects: data.projects || initialPortfolioData.projects,
              testimonials: data.testimonials || initialPortfolioData.testimonials,
              memories: data.memories || initialPortfolioData.memories,
              blogs: data.blogs || initialPortfolioData.blogs,
              seo: data.seo || initialPortfolioData.seo,
            };
            setPortfolioData(merged);
            localStorage.setItem("portfolio_cached_data", JSON.stringify(merged));
            console.log("Portfolio data loaded successfully from Cloud Firestore and cached locally.");
          } else {
            console.log("No data found in Firestore collection. Provisioning database with defaults...");
            await setDoc(docRef, initialPortfolioData);
            setPortfolioData(initialPortfolioData);
            localStorage.setItem("portfolio_cached_data", JSON.stringify(initialPortfolioData));
          }
        } catch (e) {
          console.error("Firestore read error:", e);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("Firebase not configured. Using initial default state.");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const cleanUndefined = (obj: any): any => {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(cleanUndefined);
    }
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined) {
        cleaned[key] = cleanUndefined(val);
      }
    }
    return cleaned;
  };

  const saveAndSetData = async (newData: PortfolioData) => {
    const cleanedData = cleanUndefined(newData);
    setPortfolioData(newData);
    localStorage.setItem("portfolio_cached_data", JSON.stringify(newData));

    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, "portfolio_config", "data");
        await setDoc(docRef, cleanedData);
        console.log("Synchronized portfolio state to Cloud Firestore successfully.");
      } catch (error) {
        console.error("Failed to sync with Firestore:", error);
      }
    } else {
      console.warn("Cannot save changes: Firebase is not configured.");
    }
  };

  const updateHomeAbout = (homeData: PortfolioData["home"], aboutData: PortfolioData["about"]) => {
    saveAndSetData({ ...portfolioData, home: homeData, about: aboutData });
  };

  const updateSkills = (skillsData: PortfolioData["skills"]) => {
    saveAndSetData({ ...portfolioData, skills: skillsData });
  };

  const updateServices = (servicesData: PortfolioData["services"]) => {
    saveAndSetData({ ...portfolioData, services: servicesData });
  };

  const updateQualification = (qualificationData: PortfolioData["qualification"]) => {
    saveAndSetData({ ...portfolioData, qualification: qualificationData });
  };

  const updateProjects = async (projectsData: PortfolioData["projects"]) => {
    saveAndSetData({ ...portfolioData, projects: projectsData });

    if (isFirebaseConfigured && db) {
      try {
        const currentProjects = portfolioData.projects || [];
        const newIds = new Set(projectsData.map((p) => p.id));
        
        for (const p of currentProjects) {
          if (!newIds.has(p.id)) {
            await deleteDoc(doc(db, "projects", p.id));
          }
        }
        for (const p of projectsData) {
          await setDoc(doc(db, "projects", p.id), p);
        }
      } catch (err) {
        console.warn("Failed to sync projects collection (this is normal if rules are not deployed yet):", err);
      }
    }
  };

  const updateTestimonials = (testimonialsData: PortfolioData["testimonials"]) => {
    saveAndSetData({ ...portfolioData, testimonials: testimonialsData });
  };

  const updateMemories = async (memoriesData: PortfolioData["memories"]) => {
    saveAndSetData({ ...portfolioData, memories: memoriesData });

    if (isFirebaseConfigured && db) {
      try {
        const currentMemories = portfolioData.memories || [];
        const newIds = new Set(memoriesData.map((m) => m.id));

        for (const m of currentMemories) {
          if (!newIds.has(m.id)) {
            await deleteDoc(doc(db, "memories", m.id));
          }
        }
        for (const m of memoriesData) {
          await setDoc(doc(db, "memories", m.id), m);
        }
      } catch (err) {
        console.warn("Failed to sync memories collection:", err);
      }
    }
  };

  const updateBlogs = async (blogsData: NonNullable<PortfolioData["blogs"]>) => {
    saveAndSetData({ ...portfolioData, blogs: blogsData });

    if (isFirebaseConfigured && db) {
      try {
        const currentBlogs = portfolioData.blogs || [];
        const newIds = new Set(blogsData.map((b) => b.id));

        for (const b of currentBlogs) {
          if (!newIds.has(b.id)) {
            await deleteDoc(doc(db, "blogs", b.id));
          }
        }
        for (const b of blogsData) {
          await setDoc(doc(db, "blogs", b.id), b);
        }
      } catch (err) {
        console.warn("Failed to sync blogs collection:", err);
      }
    }
  };

  const updateSeo = (seoData: NonNullable<PortfolioData["seo"]>) => {
    saveAndSetData({ ...portfolioData, seo: seoData });
  };

  // Dynamic Query Fetchers with Fallbacks
  const fetchProjects = async (limitCount?: number): Promise<any[]> => {
    if (isFirebaseConfigured && db) {
      try {
        const colRef = collection(db, "projects");
        const q = limitCount ? query(colRef, limit(limitCount)) : colRef;
        const snap = await getDocs(q);
        const list: any[] = [];
        snap.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });
        if (list.length > 0) {
          return list.sort((a, b) => b.id.localeCompare(a.id));
        }
      } catch (err) {
        console.warn("projects collection read failed, falling back to document:", err);
      }
    }
    const list = portfolioData.projects || [];
    return limitCount ? list.slice(0, limitCount) : list;
  };

  const fetchMemories = async (limitCount?: number): Promise<any[]> => {
    if (isFirebaseConfigured && db) {
      try {
        const colRef = collection(db, "memories");
        const q = limitCount ? query(colRef, limit(limitCount)) : colRef;
        const snap = await getDocs(q);
        const list: any[] = [];
        snap.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });
        if (list.length > 0) {
          return list.sort((a, b) => b.id.localeCompare(a.id));
        }
      } catch (err) {
        console.warn("memories collection read failed, falling back to document:", err);
      }
    }
    const list = portfolioData.memories || [];
    return limitCount ? list.slice(0, limitCount) : list;
  };

  const fetchBlogs = async (limitCount?: number): Promise<any[]> => {
    if (isFirebaseConfigured && db) {
      try {
        const colRef = collection(db, "blogs");
        const q = limitCount ? query(colRef, limit(limitCount)) : colRef;
        const snap = await getDocs(q);
        const list: any[] = [];
        snap.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });
        if (list.length > 0) {
          return list.sort((a, b) => b.id.localeCompare(a.id));
        }
      } catch (err) {
        console.warn("blogs collection read failed, falling back to document:", err);
      }
    }
    const list = portfolioData.blogs || [];
    return limitCount ? list.slice(0, limitCount) : list;
  };

  const fetchBlogPost = async (id: string): Promise<any | null> => {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { ...docSnap.data(), id: docSnap.id };
        }
      } catch (err) {
        console.warn("single blog document read failed, falling back to document list:", err);
      }
    }
    return (portfolioData.blogs || []).find((b) => b.id === id) || null;
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolioData,
        isLoading,
        updateHomeAbout,
        updateSkills,
        updateServices,
        updateQualification,
        updateProjects,
        updateTestimonials,
        updateMemories,
        updateBlogs,
        updateSeo,
        fetchProjects,
        fetchMemories,
        fetchBlogs,
        fetchBlogPost,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolioData must be used within a PortfolioProvider");
  }
  return context;
};
