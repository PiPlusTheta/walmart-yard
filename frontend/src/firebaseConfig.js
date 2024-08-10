import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Replace these with your Firebase project's config values
const firebaseConfig = {
    apiKey: "AIzaSyD6VFFbdc8ykV9hagXI5BS26DnmeyrHevA",
    authDomain: "walmart-yard-management.firebaseapp.com",
    projectId: "walmart-yard-management",
    storageBucket: "walmart-yard-management.appspot.com",
    messagingSenderId: "977822941227",
    appId: "1:977822941227:web:525ac135c10a6b7d016a6e"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

