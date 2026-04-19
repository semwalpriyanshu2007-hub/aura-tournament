import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwpyphuoBSx3i92sLiQ21RcBSUszM3MXM",
  authDomain: "turnament-85bba.firebaseapp.com",
  projectId: "turnament-85bba",
  storageBucket: "turnament-85bba.appspot.com",
  messagingSenderId: "844005454213",
  appId: "1:844005454213:web:5eb02d83b8a657a3a954ec",
  measurementId: "G-3Z2HW82BE5"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
