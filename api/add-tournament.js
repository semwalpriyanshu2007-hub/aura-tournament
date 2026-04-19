import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// 🔥 Firebase config (same jo tu firebase.ts me use kar raha hai)
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
  if (req.method === "POST") {
    try {
      const { name, entryFee } = req.body;

      if (!name || !entryFee) {
        return res.status(400).json({ message: "Missing fields" });
      }

      // 🔥 FIRESTORE SAVE
      await addDoc(collection(db, "tournaments"), {
        name,
        entryFee,
        joinedSlots: 0,
        maxSlots: 100,
        createdAt: new Date()
      });

      return res.status(200).json({
        success: true,
        message: "Tournament added ✅"
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error saving to DB ❌" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
