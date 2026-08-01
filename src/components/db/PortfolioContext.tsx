import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(initialPortfolioData);
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
            setPortfolioData({
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
            });
            console.log("Portfolio data loaded successfully from Cloud Firestore.");
          } else {
            // First time running: provision Firestore with initial default data
            console.log("No data found in Firestore collection. Provisioning database with defaults...");
            await setDoc(docRef, initialPortfolioData);
            setPortfolioData(initialPortfolioData);
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

  const saveAndSetData = async (newData: PortfolioData) => {
    setPortfolioData(newData);

    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, "portfolio_config", "data");
        await setDoc(docRef, newData);
        console.log("Synchronized portfolio state to Cloud Firestore.");
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

  const updateProjects = (projectsData: PortfolioData["projects"]) => {
    saveAndSetData({ ...portfolioData, projects: projectsData });
  };

  const updateTestimonials = (testimonialsData: PortfolioData["testimonials"]) => {
    saveAndSetData({ ...portfolioData, testimonials: testimonialsData });
  };

  const updateMemories = (memoriesData: PortfolioData["memories"]) => {
    saveAndSetData({ ...portfolioData, memories: memoriesData });
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
