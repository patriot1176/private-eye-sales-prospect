import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCkGL18BLJhn2adBTRe8AYfNLsNwtYzss",
  authDomain: "private-eye-app-b15fe.firebaseapp.com",
  projectId: "private-eye-app-b15fe",
  storageBucket: "private-eye-app-b15fe.appspot.com",
  messagingSenderId: "887822805173",
  appId: "1:887822805173:web:e18df14f90926949f6fc",
};

// Initialize app
const app = initializeApp(firebaseConfig);

// Export Firestore
export const db = getFirestore(app);
