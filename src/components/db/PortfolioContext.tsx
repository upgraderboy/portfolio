import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, query, limit } from "firebase/firestore";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from "firebase/auth";
import { db, auth, isFirebaseConfigured } from "./firebase";
import { initialPortfolioData, PortfolioData } from "./portfolioDb";

interface PortfolioContextType {
  portfolioData: PortfolioData;
  isLoading: boolean;
  user: any | null;
  authLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  logOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateHomeAbout: (homeData: PortfolioData["home"], aboutData: PortfolioData["about"]) => void;
  updateSkills: (skillsData: PortfolioData["skills"]) => void;
  updateServices: (servicesData: PortfolioData["services"]) => void;
  updateQualification: (qualificationData: PortfolioData["qualification"]) => void;
  updateProjects: (projectsData: PortfolioData["projects"]) => void;
  updateTestimonials: (testimonialsData: PortfolioData["testimonials"]) => void;
  updateMemories: (memoriesData: PortfolioData["memories"]) => void;
  updateBlogs: (blogsData: NonNullable<PortfolioData["blogs"]>) => void;
  updateSeo: (seoData: NonNullable<PortfolioData["seo"]>) => void;
  updateResources: (resourcesData: NonNullable<PortfolioData["resources"]>) => void;
  updateResourceCategories: (categoriesData: NonNullable<PortfolioData["resourceCategories"]>) => void;
  
  // Dynamic query optimized fetchers
  fetchProjects: (limitCount?: number) => Promise<any[]>;
  fetchMemories: (limitCount?: number) => Promise<any[]>;
  fetchBlogs: (limitCount?: number) => Promise<any[]>;
  fetchBlogPost: (id: string) => Promise<any | null>;

  // Comments and Likes Scalable Actions
  likeBlogPost: (blogId: string, userId: string) => Promise<void>;
  unlikeBlogPost: (blogId: string, userId: string) => Promise<void>;
  checkUserLikedBlogPost: (blogId: string, userId: string) => Promise<boolean>;
  fetchBlogPostLikesCount: (blogId: string) => Promise<number>;
  addCommentToBlogPost: (blogId: string, text: string, user: any) => Promise<any>;
  deleteCommentFromBlogPost: (blogId: string, commentId: string) => Promise<void>;
  fetchBlogPostComments: (blogId: string) => Promise<any[]>;
  updateCommentInBlogPost: (blogId: string, commentId: string, text: string) => Promise<void>;
  replyToCommentInBlogPost: (blogId: string, commentId: string, replyText: string, currentUser: any) => Promise<any>;
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
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Auth state listener
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setAuthLoading(false);
      });
      return () => unsubscribe();
    } else {
      const cachedUser = localStorage.getItem("portfolio_mock_user");
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch (e) {
          localStorage.removeItem("portfolio_mock_user");
        }
      }
      setAuthLoading(false);
    }
  }, []);

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
              seo: data.seo ? { ...initialPortfolioData.seo, ...data.seo } : initialPortfolioData.seo,
              resources: data.resources || initialPortfolioData.resources,
              resourceCategories: data.resourceCategories || initialPortfolioData.resourceCategories,
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

  const updateResources = async (resourcesData: NonNullable<PortfolioData["resources"]>) => {
    saveAndSetData({ ...portfolioData, resources: resourcesData });

    if (isFirebaseConfigured && db) {
      try {
        const currentResources = portfolioData.resources || [];
        const newIds = new Set(resourcesData.map((r) => r.id));

        for (const r of currentResources) {
          if (!newIds.has(r.id)) {
            await deleteDoc(doc(db, "resources", r.id));
          }
        }
        for (const r of resourcesData) {
          await setDoc(doc(db, "resources", r.id), r);
        }
      } catch (err) {
        console.warn("Failed to sync resources collection:", err);
      }
    }
  };

  const updateResourceCategories = (categoriesData: NonNullable<PortfolioData["resourceCategories"]>) => {
    saveAndSetData({ ...portfolioData, resourceCategories: categoriesData });
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

  const signInWithGoogle = async () => {
    if (isFirebaseConfigured && auth) {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } else {
      const mockUser = {
        uid: "mock-google-" + Date.now(),
        email: "upgraderboy.mock@gmail.com",
        displayName: "Ankit Bhuria (Mock)",
        photoURL: "https://raw.githubusercontent.com/upgraderboy/Portfolio-PDF-Assets/main/Ankit%20Bhuria.jpeg"
      };
      setUser(mockUser);
      localStorage.setItem("portfolio_mock_user", JSON.stringify(mockUser));
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      const accountsStr = localStorage.getItem("portfolio_mock_accounts") || "[]";
      const accounts = JSON.parse(accountsStr);
      const found = accounts.find((a: any) => a.email.toLowerCase() === email.toLowerCase() && a.password === pass);
      if (found) {
        const loggedUser = {
          uid: found.uid,
          email: found.email,
          displayName: found.displayName,
          photoURL: null
        };
        setUser(loggedUser);
        localStorage.setItem("portfolio_mock_user", JSON.stringify(loggedUser));
      } else {
        throw new Error("Invalid credentials. Try creating a mock account first!");
      }
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && cred.user) {
        await updateProfile(cred.user, { displayName: name });
      }
    } else {
      const accountsStr = localStorage.getItem("portfolio_mock_accounts") || "[]";
      const accounts = JSON.parse(accountsStr);
      if (accounts.some((a: any) => a.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Account already exists!");
      }
      const newAccount = {
        uid: "mock-uid-" + Date.now(),
        email: email,
        password: pass,
        displayName: name || email.split("@")[0]
      };
      accounts.push(newAccount);
      localStorage.setItem("portfolio_mock_accounts", JSON.stringify(accounts));
      
      const loggedUser = {
        uid: newAccount.uid,
        email: newAccount.email,
        displayName: newAccount.displayName,
        photoURL: null
      };
      setUser(loggedUser);
      localStorage.setItem("portfolio_mock_user", JSON.stringify(loggedUser));
    }
  };

  const logOut = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    } else {
      setUser(null);
      localStorage.removeItem("portfolio_mock_user");
    }
  };

  const refreshUser = async () => {
    if (isFirebaseConfigured && auth && auth.currentUser) {
      await auth.currentUser.reload();
      setUser(auth.currentUser);
    }
  };

  // Likes Actions
  const likeBlogPost = async (blogId: string, userId: string) => {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, "blogs", blogId, "likes", userId);
      await setDoc(docRef, {
        likedAt: new Date().toISOString(),
        userId
      });
    } else {
      const likesKey = `mock_likes_${blogId}`;
      const listStr = localStorage.getItem(likesKey) || "[]";
      const list = JSON.parse(listStr);
      if (!list.includes(userId)) {
        list.push(userId);
        localStorage.setItem(likesKey, JSON.stringify(list));
      }
    }
  };

  const unlikeBlogPost = async (blogId: string, userId: string) => {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, "blogs", blogId, "likes", userId);
      await deleteDoc(docRef);
    } else {
      const likesKey = `mock_likes_${blogId}`;
      const listStr = localStorage.getItem(likesKey) || "[]";
      const list = JSON.parse(listStr);
      const filtered = list.filter((id: string) => id !== userId);
      localStorage.setItem(likesKey, JSON.stringify(filtered));
    }
  };

  const checkUserLikedBlogPost = async (blogId: string, userId: string): Promise<boolean> => {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, "blogs", blogId, "likes", userId);
      const snap = await getDoc(docRef);
      return snap.exists();
    } else {
      const likesKey = `mock_likes_${blogId}`;
      const listStr = localStorage.getItem(likesKey) || "[]";
      const list = JSON.parse(listStr);
      return list.includes(userId);
    }
  };

  const fetchBlogPostLikesCount = async (blogId: string): Promise<number> => {
    if (isFirebaseConfigured && db) {
      try {
        const colRef = collection(db, "blogs", blogId, "likes");
        const snap = await getDocs(colRef);
        return snap.size;
      } catch (err) {
        console.error("Failed to fetch likes count from Firestore:", err);
        return 0;
      }
    } else {
      const likesKey = `mock_likes_${blogId}`;
      const listStr = localStorage.getItem(likesKey) || "[]";
      const list = JSON.parse(listStr);
      return list.length;
    }
  };

  // Comments Actions
  const addCommentToBlogPost = async (blogId: string, text: string, currentUser: any): Promise<any> => {
    const newComment = {
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email?.split("@")[0] || "Anonymous",
      userPhoto: currentUser.photoURL || null,
      text,
      timestamp: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      const colRef = collection(db, "blogs", blogId, "comments");
      const docRef = doc(colRef);
      const commentWithId = { ...newComment, id: docRef.id };
      await setDoc(docRef, commentWithId);
      return commentWithId;
    } else {
      const commentsKey = `mock_comments_${blogId}`;
      const listStr = localStorage.getItem(commentsKey) || "[]";
      const list = JSON.parse(listStr);
      const commentWithId = { ...newComment, id: "mock-comment-" + Date.now() };
      list.push(commentWithId);
      localStorage.setItem(commentsKey, JSON.stringify(list));
      return commentWithId;
    }
  };

  const deleteCommentFromBlogPost = async (blogId: string, commentId: string) => {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, "blogs", blogId, "comments", commentId);
      await deleteDoc(docRef);
    } else {
      const commentsKey = `mock_comments_${blogId}`;
      const listStr = localStorage.getItem(commentsKey) || "[]";
      const list = JSON.parse(listStr);
      const filtered = list.filter((c: any) => c.id !== commentId);
      localStorage.setItem(commentsKey, JSON.stringify(filtered));
    }
  };

  const fetchBlogPostComments = async (blogId: string): Promise<any[]> => {
    if (isFirebaseConfigured && db) {
      try {
        const colRef = collection(db, "blogs", blogId, "comments");
        const snap = await getDocs(colRef);
        const list: any[] = [];
        snap.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });
        return list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      } catch (err) {
        console.error("Failed to fetch comments from Firestore:", err);
        return [];
      }
    } else {
      const commentsKey = `mock_comments_${blogId}`;
      const listStr = localStorage.getItem(commentsKey) || "[]";
      const list = JSON.parse(listStr);
      return list.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
  };

  const updateCommentInBlogPost = async (blogId: string, commentId: string, text: string) => {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, "blogs", blogId, "comments", commentId);
      await setDoc(docRef, { text, updatedAt: new Date().toISOString() }, { merge: true });
    } else {
      const commentsKey = `mock_comments_${blogId}`;
      const listStr = localStorage.getItem(commentsKey) || "[]";
      const list = JSON.parse(listStr);
      const updated = list.map((c: any) => c.id === commentId ? { ...c, text, updatedAt: new Date().toISOString() } : c);
      localStorage.setItem(commentsKey, JSON.stringify(updated));
    }
  };

  const replyToCommentInBlogPost = async (blogId: string, commentId: string, replyText: string, currentUser: any): Promise<any> => {
    const newReply = {
      id: "reply-" + Date.now(),
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email?.split("@")[0] || "Anonymous",
      userPhoto: currentUser.photoURL || null,
      text: replyText,
      timestamp: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      const { arrayUnion } = await import("firebase/firestore");
      const docRef = doc(db, "blogs", blogId, "comments", commentId);
      await setDoc(docRef, { replies: arrayUnion(newReply) }, { merge: true });
    } else {
      const commentsKey = `mock_comments_${blogId}`;
      const listStr = localStorage.getItem(commentsKey) || "[]";
      const list = JSON.parse(listStr);
      const updated = list.map((c: any) => {
        if (c.id === commentId) {
          const currentReplies = c.replies || [];
          return { ...c, replies: [...currentReplies, newReply] };
        }
        return c;
      });
      localStorage.setItem(commentsKey, JSON.stringify(updated));
    }
    return newReply;
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolioData,
        isLoading,
        user,
        authLoading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logOut,
        refreshUser,
        updateCommentInBlogPost,
        replyToCommentInBlogPost,
        likeBlogPost,
        unlikeBlogPost,
        checkUserLikedBlogPost,
        fetchBlogPostLikesCount,
        addCommentToBlogPost,
        deleteCommentFromBlogPost,
        fetchBlogPostComments,
        updateHomeAbout,
        updateSkills,
        updateServices,
        updateQualification,
        updateProjects,
        updateTestimonials,
        updateMemories,
        updateBlogs,
        updateSeo,
        updateResources,
        updateResourceCategories,
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
