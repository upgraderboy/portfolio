import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ub-portfolio",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;
let isFirebaseConfigured = false;

// Check if critical configuration variables are set
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "PLACEHOLDER") {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    isFirebaseConfigured = true;
    console.log("Firebase Firestore, Storage, and Auth initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else {
  console.warn(
    "Firebase API key not detected or set to placeholder. Operating in fallback LocalStorage mode. Please configure your .env file."
  );
}

export { db, storage, auth, isFirebaseConfigured };
