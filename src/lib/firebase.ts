import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQD4urvjbCr66-Ml9mq5b79eExO_rr4vE",
  authDomain: "j-ott-23169.firebaseapp.com",
  projectId: "j-ott-23169",
  storageBucket: "j-ott-23169.firebasestorage.app",
  messagingSenderId: "254843555359",
  appId: "1:254843555359:web:c8e6c4cea98e0426b30f2a",
  measurementId: "G-2R90PWKL22"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
