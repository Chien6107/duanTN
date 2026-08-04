// Firebase Web SDK Configuration (For Firebase Phone Auth - Free & Easiest for Web Devs)
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// REPLACE these configurations with your Firebase project details
// To obtain, go to Firebase Console -> Project Settings -> General -> Your Apps -> Web App
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Helper function to initialize Recaptcha
export const initRecaptchaVerifier = (containerId) => {
  try {
    return new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: (response) => {
        // reCAPTCHA solved - allow signInWithPhoneNumber.
        console.log("ReCaptcha solved successfully:", response);
      },
      "expired-callback": () => {
        console.warn("ReCaptcha expired. Please reset.");
      }
    });
  } catch (error) {
    console.error("Error setting up Firebase RecaptchaVerifier:", error);
    return null;
  }
};

// Send OTP function using actual Firebase Auth Phone provider
export const sendSmsOtpFirebase = async (phoneNumber, appVerifier) => {
  try {
    // Converts phone to international format: e.g. 0362804559 -> +84362804559
    let formattedPhone = phoneNumber.trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "+84" + formattedPhone.substring(1);
    }
    
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
    console.log("Firebase SMS confirmation sent successfully.");
    return { success: true, confirmationResult };
  } catch (error) {
    console.error("Firebase Auth SMS OTP Error:", error.message);
    return { success: false, error: error.message };
  }
};
