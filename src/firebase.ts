import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAwpyphuoBSx3i92sLiQ2lRcBSUszM3MXM",
  authDomain: "turnament-85bba.firebaseapp.com",
  projectId: "turnament-85bba",
  storageBucket: "turnament-85bba.firebasestorage.app",
  messagingSenderId: "844005454213",
  appId: "1:844005454213:web:5eb02d83b8a657a3a954ec",
  measurementId: "G-3Z2HW82BE5"
};

const app = initializeApp(firebaseConfig);
let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.warn("Analytics could not be initialized:", e);
}

export { app, analytics };
