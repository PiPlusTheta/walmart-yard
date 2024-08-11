import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6VFFbdc8ykV9hagXI5BS26DnmeyrHevA",
  authDomain: "walmart-yard-management.firebaseapp.com",
  projectId: "walmart-yard-management",
  storageBucket: "walmart-yard-management.appspot.com",
  messagingSenderId: "977822941227",
  appId: "1:977822941227:web:525ac135c10a6b7d016a6e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, db, googleProvider, facebookProvider, githubProvider };