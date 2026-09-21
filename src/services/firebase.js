import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAIXtIQAk48PyEX0pQ6ELQ1g-5nlm4wlM8",
  authDomain: "movie-mem.firebaseapp.com",
  projectId: "movie-mem",
  storageBucket: "movie-mem.firebasestorage.app",
  messagingSenderId: "788213004962",
  appId: "1:788213004962:web:338a8e082855891c9275fb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};