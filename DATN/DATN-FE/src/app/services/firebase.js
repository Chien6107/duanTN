import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHZOJ55O_kFJrhhglGXeUwwk808-34Ku8",
  authDomain: "ssms-datn.firebaseapp.com",
  projectId: "ssms-datn",
  storageBucket: "ssms-datn.firebasestorage.app",
  messagingSenderId: "1095336038631",
  appId: "1:1095336038631:web:d9982b1f9e1063f94c5242",
  measurementId: "G-P2MFB6EY2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth instance
export const auth = getAuth(app);
