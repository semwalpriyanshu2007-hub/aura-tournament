import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwypphuoBSx3i92sLiQ21RcBSUszM3MXM",
  authDomain: "turnament-85bba.firebaseapp.com",
  projectId: "turnament-85bba",
  storageBucket: "turnament-85bba.appspot.com",
  messagingSenderId: "844005454213",
  appId: "1:844005454213:web:5eb02d83b8a657a3a954ec",
  measurementId: "G-3Z2HW82BE5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  // 👉 Only GET allowed
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const snapshot = await getDocs(collection(db, "tournaments"));

    const tournaments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json({
      success: true,
      tournaments
    });

  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tournaments"
    });
  }
}
