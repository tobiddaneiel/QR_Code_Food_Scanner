import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCJkXSpkH56LtVQ_faJTvb5tfPBXf3cq3I",
  authDomain: "qr-code-food-scanner.firebaseapp.com",
  projectId: "qr-code-food-scanner",
  storageBucket: "qr-code-food-scanner.firebasestorage.app",
  messagingSenderId: "317742447133",
  appId: "1:317742447133:web:1437445967a89dd9b6a4f4",
  measurementId: "G-WJQBDMQKFY"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
